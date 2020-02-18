import React, { createContext, useContext, useState, useMemo, PropsWithChildren, FC } from 'react';

type Result<S> = void | S | Promise<void> | Promise<S>;
type GeneratorResult<S> = Generator<Result<S>, Result<S>, S> | AsyncGenerator<Result<S>, Result<S>, S>;
type ImplResult<S> = Result<S> | GeneratorResult<S>;

type Impl<S, A> = { [P in keyof A]: A[P] extends Function ? (s: S, ...args: any) => ImplResult<S> : any };

type ToExternalParameter<T> = T extends (s: any, ...args: infer P) => any ? P : never;
type FunctionOnly<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>;
type ToExternalFunctoins<A> = { [P in keyof A]: (...args: ToExternalParameter<A[P]>) => Promise<void> };
type Externals<A> = ToExternalFunctoins<FunctionOnly<A>>;

type ContextState<S, A> = { state: S; actions: Externals<A> };

function isGenerator<S>(obj: any): obj is GeneratorResult<S> {
  return obj && typeof obj.next === 'function' && typeof obj.throw === 'function' && typeof obj.return === 'function';
}

let IGNORES: string[] = [];
const extract = (obj: object, ignores = IGNORES) => {
  let t = obj;
  const set: Set<string> = new Set();
  while (t) {
    Object.getOwnPropertyNames(t)
      .filter(n => typeof (t as any)[n] === 'function' && !ignores.includes(n))
      .forEach(n => set.add(n));
    t = Object.getPrototypeOf(t);
  }
  return Array.from(set);
};

IGNORES = extract({});

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
  const [, set] = useState(0);
  const rerender = useMemo(() => () => set(c => c + 1), [set]);
  return { rerender };
};

export function createStore<S, A extends Impl<S, A>>(
  value: S,
  onChanged: (s: S) => void,
  impl: A
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
      const result = await action.bind(impl)(state, ...args);
      if (isGenerator<Result<S>>(result)) {
        let isContinue = true;
        while (isContinue) {
          const next = await result.next(state);
          feed(await next.value);
          isContinue = !next.done;
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
    extract(impl).forEach(name => (external[name] = convertAction((impl as any)[name])));
    return external as Externals<A>;
  };

  const actions = convert();
  return () => ({ state, actions });
}

type CreateResult<S, A> = { Provider: FC<PropsWithChildren<{ value: S }>>; useContext: () => ContextState<S, A> };
type Fluent<S> = { actions: <A extends Impl<S, A>>(impl: A) => CreateResult<S, A> };

function _createTinyContext<S>(): Fluent<S>;
function _createTinyContext<S, A extends Impl<S, A>>(impl: A): CreateResult<S, A>;
function _createTinyContext<S, A extends Impl<S, A>>(impl?: A): CreateResult<S, A> | Fluent<S> {
  if (impl) {
    const Context = createContext<ContextState<S, A>>({} as any);

    const Provider = ({ value, children = null }: PropsWithChildren<{ value: S }>) => {
      const { rerender } = useRerender();
      const { state, actions } = useMemo(() => createStore(value, rerender, impl), [value, rerender])();
      return useMemo(() => <Context.Provider value={{ state, actions }}>{children}</Context.Provider>, [
        state,
        actions,
        children
      ]);
    };

    return { Provider, useContext: () => useContext(Context) };
  }

  return { actions: <A extends Impl<S, A>>(impl: A) => _createTinyContext<S, A>(impl) };
}

export const createTinyContext = _createTinyContext;
