import React from 'react';

import { render, fireEvent, screen, waitForDomChange, wait } from '@testing-library/react';

import { createTinyContext, InternalActions } from '../src/tiny-context';

describe('tiny-context', () => {
  describe('simple actions', () => {
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
    const TwiceButton = () => {
      const {
        actions: { increment }
      } = useContext();
      return (
        <button
          onClick={() => {
            increment();
            increment();
          }}
        >
          button
        </button>
      );
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

    test('Action is executed sequentially when double-clicked.', async () => {
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

    test('Action is executed sequentially when the action is called twice on the same event loop.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <TwiceButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeTruthy();
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
  describe('class based actions', () => {
    type State = { count: number };
    type Actions = {
      increment: () => Promise<void>;
      asyncIncrement: () => Promise<void>;
      publicIncrement: () => Promise<void>;
      throwException: () => Promise<void>;
    };
    class Impl implements InternalActions<State, Actions> {
      increment(state: State) {
        return { count: state.count + 1 };
      }
      async asyncIncrement(state: State) {
        return { count: state.count + 1 };
      }
      publicIncrement(state: State) {
        return this.privateIncrement(state);
      }
      privateIncrement(state: State) {
        return { count: state.count + 1 };
      }
      throwException() {
        throw new Error('hoge');
      }
    }
    const { Provider, useContext } = createTinyContext<State, Actions>(new Impl());
    const IncrementButton = () => {
      const {
        actions: { increment }
      } = useContext();
      return <button onClick={increment}>button</button>;
    };
    const AsyncIncrementButton = () => {
      const {
        actions: { asyncIncrement }
      } = useContext();
      return <button onClick={asyncIncrement}>button</button>;
    };
    const RefThisButton = () => {
      const {
        actions: { publicIncrement }
      } = useContext();
      return <button onClick={publicIncrement}>button</button>;
    };
    const ExceptionButton = () => {
      const {
        actions: { throwException, increment }
      } = useContext();
      return (
        <button
          onClick={async () => {
            try {
              await throwException();
            } catch {
              increment();
            }
          }}
        >
          button
        </button>
      );
    };
    const Display = () => {
      const {
        state: { count }
      } = useContext();
      return <>count is {count}</>;
    };

    test('Actions work even if made based on Class.', async () => {
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

    test('Can create asynchronous actions.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <AsyncIncrementButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeTruthy();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 1')).toBeTruthy();
    });

    test('Can refer to This in Action.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <RefThisButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeTruthy();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 1')).toBeTruthy();
    });

    test('Handle exceptions.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <ExceptionButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeTruthy();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 1')).toBeTruthy();
    });
  });
});
