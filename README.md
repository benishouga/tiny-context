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

### Examples

Class-based actions, Async action, Generator action and Todo App examples.

https://benishouga.github.io/tiny-context/

### Limitation

- Any action in the same context is executed sequentially.
  - If you want to process in parallel like incremental search, control it out of context.
- Not support to cancel a action in processing.

## Contributions

I make heavy use of Google Translate. Please tell me if my English is wrong :)

## Lisence

MIT License
