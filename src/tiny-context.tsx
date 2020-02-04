import React, { createContext, useContext, useState, useMemo } from 'react';

type Action = (...args: any) => void | Promise<void>;
type Actions<A> = { [P in keyof A]: Action };

type InternalActionResult<S> = void | Readonly<S> | Promise<void> | Promise<Readonly<S>>;

export type InternalActions<S, A extends Actions<A>> = {
  [P in keyof A]: (state: Readonly<S>, ...args: Parameters<A[P]>) => InternalActionResult<S>;
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

export function createTinyContext<S, A extends Actions<A>>(internalActions: InternalActions<S, A>) {
  const Context = createContext<{ state: S; actions: A }>({} as any);

  const Provider = ({ value, children }: { value: S; children: React.ReactNode }) => {
    const { rerender } = useRerender();

    const memo = useMemo<{ state: S; queue: Queue }>(() => ({ state: value, queue: new Queue() }), []);

    return useMemo(() => {
      const convertAction = (
        actions: InternalActions<S, A>,
        action: (state: S, ...args: any) => InternalActionResult<S>
      ) => (...args: any) =>
        new Promise<void>((resolve, reject) => {
          const task = async () => {
            const newState = await action.bind(actions)(memo.state, ...args);
            if (newState !== null && newState !== undefined) {
              memo.state = { ...newState };
              rerender();
            }
          };
          memo.queue.push(async () => {
            task()
              .then(resolve)
              .catch(reject);
          });
        });

      const convert = (actions: InternalActions<S, A>) => {
        const internal: { [name: string]: (state: S, ...args: any) => InternalActionResult<S> } = actions as any;
        const external: { [name: string]: (...args: any) => void | Promise<void> } = {};
        extract(internal).forEach(name => (external[name] = convertAction(actions, internal[name])));
        return external as A;
      };

      return (
        <Context.Provider value={{ state: memo.state, actions: convert(internalActions) }}>{children}</Context.Provider>
      );
    }, [memo.state]);
  };

  return { Provider, useContext: () => useContext(Context) };
}
