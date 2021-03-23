import React from 'react';
import { connect } from '../../src/tiny-context';

type State = { count: number };

const { Provider, useContext } = connect<State>().to({
  increment: (state, amount: number) => ({ ...state, count: state.count + amount }),
});

const Button = () => {
  const {
    actions: { increment },
  } = useContext();

  return <button onClick={() => increment(1)}>+</button>;
};

const Display = () => {
  const {
    state: { count },
  } = useContext();
  return <>{count}</>;
};

export const MinimumApp = (): JSX.Element => (
  <Provider value={{ count: 0 }}>
    MinimumApp: <Button /> <Display />
  </Provider>
);
