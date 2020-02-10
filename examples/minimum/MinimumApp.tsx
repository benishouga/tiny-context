import React from 'react';
import { createTinyContext, ExternalActions } from '../../src/tiny-context';

type State = { count: number };

const actions = {
  increment: (state: State) => ({ ...state, count: state.count + 1 })
};

const { Provider, useContext } = createTinyContext<State, ExternalActions<typeof actions>>(actions);

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
