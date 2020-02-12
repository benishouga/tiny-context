import React from 'react';
import { wait } from '../wait';
import { createTinyContext } from '../../src/tiny-context';

type State = { count: number; lock: boolean };

const actions = {
  setLock: (state: State, lock: boolean) => ({ ...state, lock }),
  increment: async (state: State, amount: number) => {
    await wait(); // network delays...
    return { ...state, count: state.count + amount };
  }
};

const { Provider, useContext } = createTinyContext<State>().actions(actions);

const Button = () => {
  const {
    state: { lock },
    actions: { setLock, increment }
  } = useContext();

  return (
    <button
      disabled={lock}
      onClick={async () => {
        setLock(true);
        await increment(1);
        setLock(false);
      }}
    >
      +
    </button>
  );
};

const Display = () => {
  const {
    state: { count }
  } = useContext();
  return <>{count}</>;
};

export const AsyncApp = () => (
  <Provider value={{ count: 0, lock: false }}>
    AsyncApp: <Button /> <Display />
  </Provider>
);
