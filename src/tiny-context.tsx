import React, { createContext, useContext, useState, useMemo } from 'react';

type Action = (...args: any) => void | Promise<void>;
type Actions<A> = { [P in keyof A]: Action };

type ContextState<S, A> = { state: S; actions: A };

type ActionResult<S> = void | S | Promise<void> | Promise<S>;
type GeneratorResult<S> =
  | Generator<ActionResult<S>, ActionResult<S>, S>
  | AsyncGenerator<ActionResult<S>, ActionResult<S>, S>;
type InternalActionResult<S> = ActionResult<S> | GeneratorResult<S>;

export type InternalActions<S, A extends Actions<A>> = {
  [P in keyof A]: (state: S, ...args: Parameters<A[P]>) => InternalActionResult<S>;
};

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

const useRerender = () => {
  const [_, set] = useState(0);
  return { rerender: () => set(c => c + 1) };
};

class Queue {
  private q: (() => Promise<void>)[] = [];

  push(task: () => Promise<void>) {
    const free = !this.q.length;
    this.q.push(task);
    if (free) this.awake();
  }

  awake() {
    const next = this.q[0];
    if (next) {
      next().finally(() => {
        this.q.shift();
        this.awake();
      });
    }
  }
}

export function createStore<S, A extends Actions<A>>(
  value: S,
  onStateChanged: (s: S) => void,
  actions: InternalActions<S, A>
): () => ContextState<S, A> {
  let state: S = value;
  const queue = new Queue();

  const feed = (newState: void | S) => {
    if (newState !== null && newState !== undefined) {
      state = { ...newState };
      onStateChanged(state);
    }
  };

  const convertAction = (action: (state: S, ...args: any) => InternalActionResult<S>) => (...args: any) => {
    const task = async () => {
      const actionResult = await action.bind(actions)(state, ...args);
      if (!isGenerator<ActionResult<S>>(actionResult)) {
        feed(actionResult);
        return;
      }
      while (true) {
        const result = await actionResult.next(state);
        feed(await result.value);
        if (result.done) break;
      }
    };

    return new Promise<void>((resolve, reject) => {
      queue.push(async () => {
        await task()
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const convert = () => {
    const external: { [name: string]: (...args: any) => void | Promise<void> } = {};
    extract(actions).forEach(name => (external[name] = convertAction((actions as any)[name])));
    return external as A;
  };

  const externalActions = convert();
  return () => ({ state, actions: externalActions });
}

export function createTinyContext<S, A extends Actions<A>>(internalActions: InternalActions<S, A>) {
  const Context = createContext<ContextState<S, A>>({} as any);

  const Provider = ({ value, children }: { value: S; children: React.ReactNode }) => {
    const { rerender } = useRerender();
    const { state, actions } = useMemo<() => ContextState<S, A>>(
      () => createStore(value, rerender, internalActions),
      []
    )();
    return useMemo(() => {
      return <Context.Provider value={{ state, actions }}>{children}</Context.Provider>;
    }, [state]);
  };

  return { Provider, useContext: () => useContext(Context) };
}
