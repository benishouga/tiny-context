import React from 'react';
import { wait } from '../wait';
import { createTinyContext, ExternalActions } from '../../src/tiny-context';

type State = { count: number; lock: boolean };

class Actions {
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

const { Provider, useContext } = createTinyContext<State, ExternalActions<Actions>>(new Actions());

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
