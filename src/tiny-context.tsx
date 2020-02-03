import React, { createContext, useContext, useState, useMemo } from 'react';

type Action<S> = (...args: any) => Promise<void> | Promise<S>;
type Actions<S, A> = { [P in keyof A]: Action<S> };

export type InternalActions<S, A extends Actions<S, A>> = {
  [P in keyof A]: (
    state: Readonly<S>,
    ...args: Parameters<A[P]>
  ) => void | Readonly<S> | Promise<void> | Promise<Readonly<S>>;
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

export function createTinyContext<S, A extends Actions<S, A>>(internalActions: InternalActions<S, A>) {
  const Context = createContext<{ state: S; actions: A }>({} as any);

  const Provider = ({ value, children }: { value: S; children: React.ReactNode }) => {
    const { rerender } = useRerender();

    const c = useMemo<{ state: S; queue: Queue }>(() => ({ state: value, queue: new Queue() }), []);

    return useMemo(() => {
      const convertAction = (
        actions: InternalActions<S, A>,
        action: (state: S, ...args: any) => Promise<void> | Promise<S>
      ) => (...args: any) =>
        new Promise<void>((resolve, reject) => {
          const task = async (state: S) => {
            const newState = await action.bind(actions)(state, ...args);
            if (newState !== null && newState !== undefined) {
              c.state = { ...newState };
              rerender();
            }
          };
          c.queue.push(async () => {
            task(c.state)
              .then(resolve)
              .catch(reject);
          });
        });

      const convert = (actions: InternalActions<S, A>) => {
        const internal: { [name: string]: (state: S, ...args: any) => Promise<void> | Promise<S> } = actions as any;
        const external: { [name: string]: (...args: any) => Promise<void> } = {};
        extract(internal).forEach(name => (external[name] = convertAction(actions, internal[name])));
        return external as A;
      };

      return (
        <Context.Provider value={{ state: c.state, actions: convert(internalActions) }}>{children}</Context.Provider>
      );
    }, [c.state]);
  };

  return { Provider, useContext: () => useContext(Context) };
}
