# tiny-context

![GITHUB-BADGE](https://github.com/benishouga/tiny-context/workflows/Node.js%20CI/badge.svg)

This library for Context API of React Hooks. Easily create a context with a state and an action to update it.

## Installation

Requires React 16.8.3 or later.

```
npm install tiny-context
```

## Concept

This library wraps the React Context API and supports creating contexts with `{ state: { ... }, actions: { ... } }`.

- Easy to implement with less code.
- Easy to understand. (like React Context API with Hooks)
- Easy to create async action and async generator action. (I think it's like redux-saga.)
- Easy to test. (Only test a stateless implementation.)
- TypeScript friendry. (Strict type checking.)

## Steps to use

1. Define `State`.
   ```ts
   type CounterState = { count: number };
   ```
2. Define `actions` that takes `State` as the first argument and returns `State`. `actions` can also be created on a [class-base](https://benishouga.github.io/tiny-context/).
   ```ts
   const actions = {
     increment: (state: CounterState, amount: number) => ({ ...state, count: state.count + amount }),
   };
   ```
3. Call `createTinyContext` to create `Provider` and `useContext` from `actions`. Specify the `State` and `actions` for the type argument.
   ```ts
   const { Provider, useContext } = createTinyContext<CounterState, typeof actions>(actions);
   ```
   (option) If you use the `actions` method, you only need to specify `State` type argument.
   ```ts
   const { Provider, useContext } = createTinyContext<CounterState>().actions(actions);
   ```
4. Can be used like the React Context API :)

   ```tsx
   const Buttons = () => {
     const {
       actions: { increment },
     } = useContext();
     return <button onClick={() => increment(1)}>+</button>;
   };

   const Display = () => {
     const {
       state: { count },
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

Class-based actions, Async action, Async generator action, abortable request, and Todo App examples.<br>
https://benishouga.github.io/tiny-context/

## API

### createTinyContext

Create Provider and useContext from Actions implementations. Actions implementation methods require the first argument to be `State` and the return value to be `State` (or [`Promise`, `Async Generator`](https://benishouga.github.io/tiny-context/)).

Specify the `State` and the `Actions` interface for the type argument.

```ts
import { createTinyContext } from 'tiny-context';

type CounterState = { count: number; };
class CounterActions {
  increment: (state: CounterState, amount: number) => ({ ...state, count: state.count + amount }),
  decrement: (state: CounterState, amount: number) => ({ ...state, count: state.count - amount })
}
const { Provider, useContext } = createTinyContext<CounterState, CounterActions>(new CounterActions());
```

If the `actions` method is used, the type argument of `Actions` can be omitted.

```ts
const { Provider, useContext } = createTinyContext<CounterState>().actions(new CounterActions());
```

`Provider` is same as [`Provider of React`](https://reactjs.org/docs/context.html#contextprovider).

Supply an initial value for `value`.

```tsx
const SomeApp = () => (
  <Provider value={{ count: 0 }}>
    <SomeConsumer />
  </Provider>
);
```

`useContext` is hooks used on a consumer. Not need arguments. You will get an object of `{ state: {...}, acitons: {...} }`.

Function arguments are inherited from the second and subsequent arguments of the previously defined Action. The return value is a uniform `Promise<State>`.

```tsx
const SomeConsumer = () => {
  const {
    state: {...},
    actions: {...}
  } = useContext();

};
```

### class Store<S, A>

Class for managing the `State`. ([`createTinyContext`](https://github.com/benishouga/tiny-context#createTinyContext) uses this.)

Given a `State` and `Actions` to change `State`, `Actions` are sequenced to prevent invalid `State`.

- **S** `State` to managed.
- **A** `Actions` to change `State`. `Actions` implementation methods require the first argument to be `State` and the return value to be `State` (or [`Promise`, `Async Generator`](https://benishouga.github.io/tiny-context/)).

#### constructor(state, impl)

- **state** Initial `State`.
- **impl** `Actions` to change `State`.

```ts
type State = { count: number };
const store = new Store(
  { count: 0 },
  { increment: (state: State, amount: number) => ({ count: state.count + amount }) }
);
const { increment } = store.actions;
await increment(1);
const { count } = store.state;
console.log(count); // => 1
```

#### readonly state

Current `State`.

#### readonly actions

`Actions` to change `State`.

Function arguments are inherited from the second and subsequent arguments of the previously defined Action. The return value is a uniform `Promise<State>`.

#### onChanged(listener)

Adds a change listener.

## Limitation

- Any action in the same context is executed sequentially.
  - When processing in parallel, process them together outside the context or within the context.

## Contributions

I make heavy use of Google Translate. Please tell me if my English is wrong :)

## Lisence

MIT License
