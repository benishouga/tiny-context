import React, { createContext, useContext, useState, useMemo, PropsWithChildren, FC, useCallback } from 'react';
import { Externals, Impl, Store } from './store';

export { Store };

type ContextState<S, A> = { state: S; actions: Externals<S, A> };

const useRerender = () => {
  const [, set] = useState(0);
  return useCallback(() => set((c) => c + 1), [set]);
};

type CreateResult<S, A> = { Provider: FC<PropsWithChildren<{ value: S }>>; useContext: () => ContextState<S, A> };
type Fluent<S> = { to: <A extends Impl<S, A>>(impl: A) => CreateResult<S, A> };

function _connect<S>(): Fluent<S> {
  return {
    to: <A extends Impl<S, A>>(impl: A) => {
      const Context = createContext<ContextState<S, A>>({} as any);

      const Provider = ({ value, children = null }: PropsWithChildren<{ value: S }>) => {
        const rerender = useRerender();
        const { state, actions } = useMemo(() => new Store(value, impl).onChanged(rerender), [value, rerender]);
        return <Context.Provider value={{ state, actions }}>{children}</Context.Provider>;
      };

      return { Provider, useContext: () => useContext(Context) };
    },
  };
}

/**
 * Class for managing the `State`.

 * @template S `State` to managed.
 * @template A `Actions` to change `State`.
 *   `Actions` implementation methods require the first argument to be Immer's Draft<`State`>.
 * @returns `Provider` and `useContext`.
 * @see https://github.com/benishouga/tiny-context#connect-to
 */
export const connect = _connect;
