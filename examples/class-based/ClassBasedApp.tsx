import React from 'react';
import { createTinyContext, InternalActions } from '../../src/tiny-context';

type State = { count: number };
type Actions = { increment: () => void };

class ActionsImpl implements InternalActions<State, Actions> {
  increment(state: State) {
    return { ...state, count: state.count + 1 };
  }
}

const { Provider, useContext } = createTinyContext<State, Actions>(new ActionsImpl());

const Button = () => {
  const {
    actions: { increment }
  } = useContext();

  return <button onClick={increment}>+</button>;
};

const Display = () => {
  const {
    state: { count }
  } = useContext();
  return <>{count}</>;
};

export const ClassBasedApp = () => (
  <Provider value={{ count: 0 }}>
    ClassBasedApp: <Button /> <Display />
  </Provider>
);
