import React from 'react';
import { wait } from '../wait';
import { createTinyContext } from '../../src/tiny-context';

type State = { count: number; lock: boolean };
type Actions = { setLock: (lock: boolean) => void; increment: () => Promise<void> };

const { Provider, useContext } = createTinyContext<State, Actions>({
  setLock: (state, lock) => ({ ...state, lock }),
  increment: async state => {
    await wait(); // network delays...
    return { ...state, count: state.count + 1 };
  }
});

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
        await increment();
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
