import React, { useState, useEffect } from 'react';
import { createTinyContext } from '../../src/tiny-context';
import { wait } from '../wait';

type State = { text: string; error: string; requesting: boolean };

class Actions {
  async *fetch(state: State, target: string, signal: AbortSignal) {
    state = yield { ...state, requesting: true };
    try {
      const res = await fetch(`./${target}`, { signal });
      await wait({ signal }); // more delay !!
      const text = await res.text();
      return { ...state, text, error: '', requesting: false };
    } catch (error) {
      return { ...state, text: '', error: 'fetch error', requesting: false };
    }
  }
}

const { Provider, useContext } = createTinyContext<State>().actions(new Actions());

const Buttons = () => {
  const [abortController, setAbortController] = useState(new AbortController());
  const {
    actions: { fetch }
  } = useContext();

  const feeeeeeeetch = (target: string) => {
    abortController.abort();
    const next = new AbortController();
    setAbortController(next);
    fetch(target, next.signal);
  };

  useEffect(() => {
    feeeeeeeetch('data1');
    return () => abortController.abort();
  }, []);

  return (
    <>
      <button onClick={() => feeeeeeeetch('data1')}>fetch data1</button>
      <button onClick={() => feeeeeeeetch('data2')}>fetch data2</button>
      <button onClick={() => abortController.abort()}>abort</button>
    </>
  );
};

const Display = () => {
  const {
    state: { text, error, requesting }
  } = useContext();
  if (requesting) {
    return <>requesting...</>;
  }
  if (!text && !error) {
    return null;
  }
  return (
    <>
      {text} <span style={{ color: '#f80' }}>{error}</span>
    </>
  );
};

export const AbortableApp = () => (
  <Provider value={{ text: '', error: '', requesting: false }}>
    AbortableApp: <Buttons /> <Display />
  </Provider>
);
