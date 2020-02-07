import React from 'react';
import { wait } from '../wait';
import { createTinyContext, InternalActions } from '../../src/tiny-context';

type State = { count: number; lock: boolean };
type Actions = { setLock: (lock: boolean) => void; increment: () => Promise<void> };

class ActionsImpl implements InternalActions<State, Actions> {
  setLock(state: State, lock: boolean) {
    return { ...state, lock };
  }
  async *increment(state: State) {
    state = yield this.setLock(state, true);

    await wait(); // network delays...
    state = yield { ...state, count: state.count + 1 };

    return this.setLock(state, false);
  }
}

const { Provider, useContext } = createTinyContext<State, Actions>(new ActionsImpl());

const Button = () => {
  const {
    state: { lock },
    actions: { increment }
  } = useContext();

  return (
    <button disabled={lock} onClick={increment}>
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

export const GeneratorApp = () => (
  <Provider value={{ count: 0, lock: false }}>
    GeneratorApp: <Button /> <Display />
  </Provider>
);
