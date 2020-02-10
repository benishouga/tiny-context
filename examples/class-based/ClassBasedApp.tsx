import React from 'react';
import { createTinyContext, ExternalActions } from '../../src/tiny-context';

type State = { count: number };

class ActionsImpl {
  increment(state: State) {
    return { ...state, count: state.count + 1 };
  }
}

const { Provider, useContext } = createTinyContext<State, ExternalActions<ActionsImpl>>(new ActionsImpl());

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
