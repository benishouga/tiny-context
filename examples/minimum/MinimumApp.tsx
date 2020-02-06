import React from 'react';
import { createTinyContext } from '../../src/tiny-context';

type State = { count: number };
type Actions = { increment: () => void };

const { Provider, useContext } = createTinyContext<State, Actions>({
  increment: state => ({ ...state, count: state.count + 1 })
});

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

export const MinimumApp = () => (
  <Provider value={{ count: 0 }}>
    MinimumApp: <Button /> <Display />
  </Provider>
);
