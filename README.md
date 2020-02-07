# tiny-context

![GITHUB-BADGE](https://github.com/benishouga/tiny-context/workflows/Node.js%20CI/badge.svg)

This library for Context API of React Hooks. Easily create a context with a state and an action to update it.

## Installation

```
npm install tiny-context
```

## Concept

This library wraps the React Context API and supports creating contexts with `{ state: { ... }, actions: { ... } }`.

- Easy to understand.
- Easy to implement with less code.
- Easy to create async action and generator action.
- Easy to test.
- TypeScript friendry.

## Steps to use

1. Define state.
   ```ts
   type CounterState = { count: number };
   ```
2. Define actions external interface.
   ```ts
   type CounterActions = { increment: () => void };
   ```
3. Define actions that takes state as the first argument and returns state.
   ```ts
   const { Provider, useContext } = createTinyContext<CounterState, CounterActions>({
     increment: state => ({ count: state.count + 1 })
   });
   ```
4. Can be used like the Context API :)

   ```tsx
   const Buttons = () => {
     const {
       actions: { increment }
     } = useContext();
     return <button onClick={increment}>+</button>;
   };

   const Display = () => {
     const {
       state: { count }
     } = useContext();
     return <span>{count}</span>;
   };

   const CounterApp = () => (
     <Provider value={{ count: 0 }}>
       <Buttons />
       <Display />
     </Provider>
   );
   ```

## Examples

Class-based actions, Async action, Generator action and Todo App examples.<br>
https://benishouga.github.io/tiny-context/

## API

### type InternalActions

```ts
import { InternalActions } from 'tiny-context';

type SomeInternalActions = InternalActions<State, Actions>;
```

Given `State` and `Actions` interface, get a `InternalActions` interface.

`Actions` methods must return a `Promise<void>`. (Although `void` can be specified, `Promise<void>` is actually returned.)

`InternalActions` methods require the first argument to be `State` and the return value to be `State` (or [`Promise`, `Generator`](https://benishouga.github.io/tiny-context/)). The second and subsequent arguments are the same as for `Actions`.

### createTinyContext

```ts
import { createTinyContext, InternalActions } from 'tiny-context';

class SomeActionImpl implements InternalActions<State, Actions> { ... }
const { Provider, useContext } = createTinyContext<State, Actions>(new SomeActionImpl());
```

`Provider` is same as [`Provider of React`](https://reactjs.org/docs/context.html#contextprovider).

```tsx
const SomeApp = () => (
  <Provider value={{...}}>
    <SomeConsumer />
  </Provider>
);
```

`useContext` is hooks used on a consumer. Not need arguments.

```tsx
const SomeConsumer = () => {
  const {
    state: {...},
    actions: {...}
  } = useContext();

};
```

## Limitation

- Any action in the same context is executed sequentially.
  - If you want to process in parallel like incremental search, control it out of context.
- Not support to cancel a action in processing.

## Contributions

I make heavy use of Google Translate. Please tell me if my English is wrong :)

## Lisence

MIT License
