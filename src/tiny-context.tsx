import React, { createContext, useContext, useState, useMemo, PropsWithChildren, FC, useCallback } from 'react';
import { Externals, Impl, Store } from './store';

type ContextState<S, A> = { state: S; actions: Externals<A> };

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
