import React, { createContext, useContext, useState, useMemo, PropsWithChildren, FC, useCallback } from 'react';

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

let ignores: string[] = [];
const extract = (obj: object) => {
  let t = obj;
  const set = new Set<string>();
  while (t) {
    Object.getOwnPropertyNames(t)
      .filter(n => typeof (t as any)[n] === 'function' && !ignores.includes(n))
      .forEach(n => set.add(n));
    t = Object.getPrototypeOf(t);
  }
  return Array.from(set);
};
ignores = extract({});

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

type Listener<S> = (s: S) => void;
export class Store<S, A extends Impl<S, A>> {
  private queue = new Queue();
  private listeners: Listener<S>[] = [];
  public readonly actions: Externals<A>;
  constructor(public state: S, impl: A) {
    this.actions = this.convertToExternals(impl);
  }
  public onChanged(listener: Listener<S>) {
    this.listeners.push(listener);
    return this;
  }
  private feed(newState: void | S) {
    if (newState !== null && newState !== undefined) {
      this.state = { ...newState };
      this.listeners.forEach(listener => listener(this.state));
    }
  }
  private convertToExternals(impl: A) {
    const external: { [name: string]: (...args: any) => void | Promise<void> } = {};
    extract(impl).forEach(name => (external[name] = this.convert((impl as any)[name].bind(impl))));
    return external as Externals<A>;
  }
  private convert(action: (state: S, ...args: any) => ImplResult<S>) {
    const passToImpl = async (args: any) => {
      const result = await action(this.state, ...args);
      if (isGenerator<Result<S>>(result)) {
        let more = true;
        while (more) {
          const next = await result.next(this.state);
          this.feed(await next.value);
          more = !next.done;
        }
      } else {
        this.feed(result);
      }
    };
    return (...args: any) =>
      new Promise<void>((resolve, reject) =>
        this.queue.push(async () => {
          await passToImpl(args)
            .then(resolve)
            .catch(reject);
        })
      );
  }
}

const useRerender = () => {
  const [, set] = useState(0);
  return useCallback(() => set(c => c + 1), [set]);
};

type CreateResult<S, A> = { Provider: FC<PropsWithChildren<{ value: S }>>; useContext: () => ContextState<S, A> };
type Fluent<S> = { actions: <A extends Impl<S, A>>(impl: A) => CreateResult<S, A> };

function _createTinyContext<S>(): Fluent<S>;
function _createTinyContext<S, A extends Impl<S, A>>(impl: A): CreateResult<S, A>;
function _createTinyContext<S, A extends Impl<S, A>>(impl?: A): CreateResult<S, A> | Fluent<S> {
  if (impl) {
    const Context = createContext<ContextState<S, A>>({} as any);

    const Provider = ({ value, children = null }: PropsWithChildren<{ value: S }>) => {
      const rerender = useRerender();
      const { state, actions } = useMemo(() => new Store(value, impl).onChanged(rerender), [value, rerender]);
      return <Context.Provider value={{ state, actions }}>{children}</Context.Provider>;
    };

    return { Provider, useContext: () => useContext(Context) };
  }

  return { actions: <A extends Impl<S, A>>(impl: A) => _createTinyContext<S, A>(impl) };
}

export const createTinyContext = _createTinyContext;
