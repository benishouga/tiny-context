import React from 'react';
import { createTinyContext } from '../../src/tiny-context';

type State = { count: number };

class Actions {
  increment(state: State, amount: number) {
    return { ...state, count: state.count + amount };
  }
}

const { Provider, useContext } = createTinyContext<State, Actions>(new Actions());

const Button = () => {
  const {
    actions: { increment }
  } = useContext();

  return <button onClick={() => increment(1)}>+</button>;
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
