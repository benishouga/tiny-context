import React from 'react';

import { render, fireEvent, screen, waitForDomChange, wait } from '@testing-library/react';

import { createTinyContext } from '../src/tiny-context';

type State = { count: number };
type Actions = { increment: () => Promise<void>; doNothing: () => Promise<void> };
const { Provider, useContext } = createTinyContext<State, Actions>({
  increment: state => ({ count: state.count + 1 }),
  doNothing: () => {}
});
const IncrementButton = () => {
  const {
    actions: { increment }
  } = useContext();
  return <button onClick={increment}>button</button>;
};
const DoNothingButton = () => {
  const {
    actions: { doNothing }
  } = useContext();
  return <button onClick={doNothing}>button</button>;
};
const Display = () => {
  const {
    state: { count }
  } = useContext();
  return <>count is {count}</>;
};

describe('tiny-context', () => {
  test('createTinyContext can create a Provider and useContext instance.', () => {
    const { Provider, useContext } = createTinyContext<{}, {}>({});
    expect(Provider).toBeTruthy();
    expect(useContext).toBeTruthy();
  });

  test('Update the State using an action.', async () => {
    render(
      <Provider value={{ count: 0 }}>
        <IncrementButton />
        <Display />
      </Provider>
    );
    expect(screen.getByText('count is 0')).toBeTruthy();
    fireEvent.click(screen.getByText('button'));
    await wait();
    expect(screen.getByText('count is 1')).toBeTruthy();
  });

  test('Action is executed sequentially.', async () => {
    render(
      <Provider value={{ count: 0 }}>
        <IncrementButton />
        <Display />
      </Provider>
    );
    expect(screen.getByText('count is 0')).toBeTruthy();
    fireEvent.click(screen.getByText('button'));
    fireEvent.click(screen.getByText('button'));
    await wait();
    expect(screen.getByText('count is 2')).toBeTruthy();
  });

  test('If the Action does not return anything, it does not update the state.', async () => {
    render(
      <Provider value={{ count: 0 }}>
        <DoNothingButton />
        <Display />
      </Provider>
    );
    expect(screen.getByText('count is 0')).toBeTruthy();
    fireEvent.click(screen.getByText('button'));
    await wait();
    expect(screen.getByText('count is 0')).toBeTruthy();
  });
});
