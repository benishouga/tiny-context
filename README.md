# tiny-context

![GITHUB-BADGE](https://github.com/benishouga/tiny-context/workflows/Node.js%20CI/badge.svg)

This library for Context API of React Hooks. Easily create a context with a state and an action to update it.<br>
**EXPERIMENTAL** This library is an experimental implementation, so performance is likely to be sacrificed.

## Installation

```
npm install tiny-context
```

## Usage

```tsx
import React from 'react';
import { createTinyContext } from 'tiny-context';

interface CounterState {
  count: number;
}

interface CounterActions {
  increment: () => Promise<void>;
  doNothing: () => Promise<void>;
}

const { Provider, useContext } = createTinyContext<CounterState, CounterActions>({
  increment: state => ({ ...state, count: state.count + 1 }),
  decrement: state => ({ ...state, count: state.count - 1 })
});

const Buttons = () => {
  const {
    actions: { increment, decrement }
  } = useContext();
  return (
    <>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
};

const Display = () => {
  const {
    state: { count }
  } = useContext();
  return <>{count}</>;
};

const CounterApp = () => {
  return (
    <Provider>
      <Buttons />
      <Display />
    </Provider>
  );
};
```

## Lisence

MIT License
