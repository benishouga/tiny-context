# tiny-context

![GITHUB-BADGE](https://github.com/benishouga/tiny-context/workflows/Node.js%20CI/badge.svg)

This library for Context API of React Hooks. Easily create a context with a state and an action to update it.<br>
**EXPERIMENTAL** This library is an experimental implementation, so performance is likely to be sacrificed.

## Installation

```
npm install tiny-context
```

## Usage

JavaScript

```jsx
import React from 'react';
import { createTinyContext } from 'tiny-context';

const { Provider, useContext } = createTinyContext({
  increment: state => ({ ...state, count: state.count + 1 }),
  decrement: state => ({ ...state, count: state.count - 1 })
});

const Buttons = () => {
  const {
    actions: { increment, decrement }
  } = useContext();
  return (
    <span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </span>
  );
};

const Display = () => {
  const {
    state: { count }
  } = useContext();
  return <span>{count}</span>;
};

const CounterApp = () => {
  return (
    <Provider value={{ count: 0 }}>
      <Buttons />
      <Display />
    </Provider>
  );
};
```

TypeScript

```tsx
import React from 'react';
import { createTinyContext } from 'tiny-context';

interface CounterState {
  count: number;
}

interface CounterActions {
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
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
    <span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </span>
  );
};

const Display = () => {
  const {
    state: { count }
  } = useContext();
  return <span>{count}</span>;
};

const CounterApp = () => {
  return (
    <Provider value={{ count: 0 }}>
      <Buttons />
      <Display />
    </Provider>
  );
};
```

## Lisence

MIT License
