import React, { createContext, useContext, useState, useMemo, PropsWithChildren, FC } from 'react';

type Result<S> = void | S | Promise<void> | Promise<S>;
type GeneratorResult<S> = Generator<Result<S>, Result<S>, S> | AsyncGenerator<Result<S>, Result<S>, S>;
type ImplResult<S> = Result<S> | GeneratorResult<S>;

type Impl<S, A> = {
  [P in keyof A]: (s: S, ...args: any) => ImplResult<S>;
};

type ToExternalParameter<T> = T extends (s: any, ...args: infer P) => any ? P : never;
type Externals<A> = {
  [P in keyof A]: (...args: ToExternalParameter<A[P]>) => void | Promise<void>;
};

type ContextState<S, A> = { state: S; actions: Externals<A> };

function isGenerator<S>(obj: any): obj is GeneratorResult<S> {
  return obj && typeof obj.next === 'function' && typeof obj.throw === 'function' && typeof obj.return === 'function';
}

const extract = (obj: object, ignores = IGNORES) => {
  let t = obj;
  const set: Set<string> = new Set();
  while (t) {
    Object.getOwnPropertyNames(t)
      .filter(n => !ignores.includes(n))
      .forEach(n => set.add(n));
    t = Object.getPrototypeOf(t);
  }
  return Array.from(set);
};

const IGNORES: string[] = extract({}, []);

type Task = () => Promise<void>;
class Queue {
  private q: Task[] = [];

  push(task: Task) {
    const free = !this.q.length;
    this.q.push(task);
    if (free) this.awake();
  }

  awake() {
    this.q[0]?.().finally(() => {
      this.q.shift();
      this.awake();
    });
  }
}

const useRerender = () => {
  const [_, set] = useState(0);
  return { rerender: () => set(c => c + 1) };
};

export function createStore<S, A extends Impl<S, A>>(
  value: S,
  onChanged: (s: S) => void,
  actions: A
): () => ContextState<S, A> {
  let state: S = value;
  const queue = new Queue();

  const feed = (newState: void | S) => {
    if (newState !== null && newState !== undefined) {
      state = { ...newState };
      onChanged(state);
    }
  };

  const convertAction = (action: (state: S, ...args: any) => ImplResult<S>) => (...args: any) => {
    const task = async () => {
      const result = await action.bind(actions)(state, ...args);
      if (isGenerator<Result<S>>(result)) {
        while (true) {
          const next = await result.next(state);
          feed(await next.value);
          if (next.done) break;
        }
      } else {
        feed(result);
      }
    };

    return new Promise<void>((resolve, reject) =>
      queue.push(async () => {
        await task()
          .then(resolve)
          .catch(reject);
      })
    );
  };

  const convert = () => {
    const external: { [name: string]: (...args: any) => void | Promise<void> } = {};
    extract(actions).forEach(name => (external[name] = convertAction((actions as any)[name])));
    return external as Externals<A>;
  };

  return () => ({ state, actions: convert() });
}

type CreateResult<S, A> = {
  Provider: FC<PropsWithChildren<{ value: S }>>;
  useContext: () => ContextState<S, A>;
};

type Fluent<S> = {
  actions: <A extends Impl<S, A>>(impl: A) => CreateResult<S, A>;
};

function _createTinyContext<S>(): Fluent<S>;
function _createTinyContext<S, A extends Impl<S, A>>(impl: A): CreateResult<S, A>;
function _createTinyContext<S, A extends Impl<S, A>>(impl?: A): CreateResult<S, A> | Fluent<S> {
  if (impl) {
    const Context = createContext<ContextState<S, A>>({} as any);

    const Provider = ({ value, children = null }: PropsWithChildren<{ value: S }>) => {
      const { rerender } = useRerender();
      const { state, actions } = useMemo(() => createStore(value, rerender, impl), [])();
      return useMemo(() => <Context.Provider value={{ state, actions }}>{children}</Context.Provider>, [state]);
    };

    return { Provider, useContext: () => useContext(Context) };
  }

  return { actions: <A extends Impl<S, A>>(impl: A) => createTinyContext<S, A>(impl) };
}

export const createTinyContext = _createTinyContext;
