import React, { useState, useEffect } from 'react';
import { createTinyContext } from '../../src/tiny-context';
import { wait } from '../wait';

type State = { text: string; error: string };

class Actions {
  async fetch(state: State, target: string, signal: AbortSignal) {
    await wait();
    try {
      const res = await fetch(`./${target}`, { signal });
      const text = await res.text();
      return { ...state, text, error: '' };
    } catch (error) {
      return { ...state, text: '', error: 'fetch error' };
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
      <button onClick={() => abortController.abort()}>cancel</button>
    </>
  );
};

const Display = () => {
  const {
    state: { text, error }
  } = useContext();
  if (!text && !error) {
    return null;
  }
  return (
    <>
      {text} <span style={{ color: '#f80' }}>{error}</span>
    </>
  );
};

export const CancelApp = () => (
  <Provider value={{ text: '', error: '' }}>
    CancelApp: <Buttons /> <Display />
  </Provider>
);
