import React, { createContext, useContext, useState, useEffect } from 'react';

type Action<S> = (...args: any) => Promise<void> | Promise<S>;
type Actions<S, A> = { [P in keyof A]: Action<S> };
type InternalActions<S, A extends Actions<S, A>> = {
  [P in keyof A]: (state: S, ...args: Parameters<A[P]>) => Promise<void> | Promise<S>;
};
type TaskQueue<S> = ((s: S) => Promise<void>) & { resolve: () => void; reject: () => void };

export function createTinyContext<S, A extends Actions<S, A>>(internalActions: InternalActions<S, A>) {
  const Context = createContext<{ state: S; actions: A }>({} as any);

  const queue: TaskQueue<S>[] = [];
  let busy = false;

  const Provider = ({ value, children }: { value: S; children: React.ReactChild }) => {
    const [state, setState] = useState<S>(value);
    const [count, setCount] = useState(0);
    const wake = () => setCount(c => c + 1);

    useEffect(() => {
      if (busy) return;
      busy = true;
      const next = queue.shift();
      if (next) {
        next({ ...state })
          .then(next.resolve)
          .catch(next.reject)
          .finally(() => {
            busy = false;
            wake();
          });
      } else {
        busy = false;
      }
    }, [count]);

    const toExternalAction = (action: (state: S, ...args: any) => Promise<void> | Promise<S>) => (...args: any) =>
      new Promise<void>((resolve, reject) => {
        const task = async (state: S) => {
          const newState = await action(state, ...args);
          if (newState !== null && newState !== undefined) {
            setState({ ...newState });
          }
        };
        task.resolve = resolve;
        task.reject = reject;
        queue.push(task);
        wake();
      });

    const toExternal = (actions: InternalActions<S, A>) => {
      const internal: { [name: string]: (state: S, ...args: any) => Promise<void> | Promise<S> } = actions as any;
      const external: { [name: string]: (...args: any) => Promise<void> } = Object.fromEntries(
        Object.entries(internal).map(([name, method]) => [name, toExternalAction(method)])
      );
      return external as A;
    };
    return <Context.Provider value={{ state, actions: toExternal(internalActions) }}>{children}</Context.Provider>;
  };

  return { Provider, useContext: () => useContext(Context) };
}
