import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type Action<S> = (...args: any) => Promise<void> | Promise<S>;
type Actions<S, A> = { [P in keyof A]: Action<S> };
type TaskQueue<S> = ((s: S) => Promise<void>) & { resolve: () => void; reject: () => void };

export type InternalActions<S, A extends Actions<S, A>> = {
  [P in keyof A]: (state: S, ...args: Parameters<A[P]>) => void | S | Promise<void> | Promise<S>;
};

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

export function createTinyContext<S, A extends Actions<S, A>>(internalActions: InternalActions<S, A>) {
  const Context = createContext<{ state: S; actions: A }>({} as any);

  const Provider = ({ value, children }: { value: S; children: React.ReactNode }) => {
    const [state, setState] = useState<S>(value);
    const [count, setCount] = useState(0);
    const wake = () => setCount(c => c + 1);

    const c = useMemo<{ queue: TaskQueue<S>[]; busy: boolean }>(() => ({ queue: [], busy: false }), []);

    useEffect(() => {
      if (c.busy) return;
      c.busy = true;
      const next = c.queue.shift();
      if (next) {
        next({ ...state })
          .then(next.resolve)
          .catch(next.reject)
          .finally(() => {
            c.busy = false;
            wake();
          });
      } else {
        c.busy = false;
      }
    }, [count]);

    const convertAction = (
      actions: InternalActions<S, A>,
      action: (state: S, ...args: any) => Promise<void> | Promise<S>
    ) => (...args: any) =>
      new Promise<void>((resolve, reject) => {
        const task = async (state: S) => {
          const newState = await action.bind(actions)(state, ...args);
          if (newState !== null && newState !== undefined) {
            setState({ ...newState });
          }
        };
        task.resolve = resolve;
        task.reject = reject;
        c.queue.push(task);
        wake();
      });

    const convert = (actions: InternalActions<S, A>) => {
      const internal: { [name: string]: (state: S, ...args: any) => Promise<void> | Promise<S> } = actions as any;
      const external: { [name: string]: (...args: any) => Promise<void> } = {};
      extract(internal).forEach(name => (external[name] = convertAction(actions, internal[name])));
      return external as A;
    };
    return useMemo(
      () => <Context.Provider value={{ state, actions: convert(internalActions) }}>{children}</Context.Provider>,
      [state]
    );
  };

  return { Provider, useContext: () => useContext(Context) };
}
