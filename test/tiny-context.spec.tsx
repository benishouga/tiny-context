import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, screen, wait, waitForElement } from '@testing-library/react';

import { createTinyContext } from '../src/tiny-context';

const wait10 = async () => new Promise(resolve => setTimeout(resolve, 10));

describe('tiny-context', () => {
  describe('simple actions', () => {
    type State = { count: number };
    const { Provider, useContext } = createTinyContext<State>().actions({
      increment: (state, amount: number) => ({ count: state.count + amount }),
      doNothing: () => {}
    });
    const IncrementButton = () => {
      const {
        actions: { increment }
      } = useContext();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const TwiceButton = () => {
      const {
        actions: { increment }
      } = useContext();
      return (
        <button
          onClick={() => {
            increment(1);
            increment(1);
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
      expect(Provider).toBeDefined();
      expect(useContext).toBeDefined();
    });

    test('Update the State using an action.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await waitForElement(() => screen.getByText('count is 1'));
      expect(screen.getByText('count is 1')).toBeInTheDocument();
    });

    test('Action is executed sequentially when double-clicked.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      fireEvent.click(screen.getByText('button'));
      await waitForElement(() => screen.getByText('count is 2'));
      expect(screen.getByText('count is 2')).toBeInTheDocument();
    });

    test('Action is executed sequentially when the action is called twice on the same event loop.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <TwiceButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await waitForElement(() => screen.getByText('count is 2'));
      expect(screen.getByText('count is 2')).toBeInTheDocument();
    });

    test('If the Action does not return anything, it does not update the state.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <DoNothingButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 0')).toBeInTheDocument();
    });

    test('Provider does not throw an error if no children.', async () => {
      render(<Provider value={{ count: 0 }} />);
    });
  });

  describe('class based actions', () => {
    type State = { count: number };
    class Actions {
      v1: number = 0;
      v2: string = '0';
      v3: boolean = false;
      increment(state: State, amount: number) {
        return { count: state.count + amount };
      }
      async asyncIncrement(state: State, amount: number) {
        return { count: state.count + amount };
      }
      publicIncrement(state: State, amount: number) {
        return this.privateIncrement(state, amount);
      }
      privateIncrement(state: State, amount: number) {
        return { count: state.count + amount };
      }
      throwException() {
        throw new Error('hoge');
      }
    }
    const { Provider, useContext } = createTinyContext<State, Actions>(new Actions());
    const IncrementButton = () => {
      const {
        actions: { increment }
      } = useContext();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const AsyncIncrementButton = () => {
      const {
        actions: { asyncIncrement }
      } = useContext();
      return <button onClick={() => asyncIncrement(1)}>button</button>;
    };
    const RefThisButton = () => {
      const {
        actions: { publicIncrement }
      } = useContext();
      return <button onClick={() => publicIncrement(1)}>button</button>;
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
              increment(1);
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
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 1')).toBeInTheDocument();
    });

    test('Can create asynchronous actions.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <AsyncIncrementButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 1')).toBeInTheDocument();
    });

    test('Can refer to This in Action.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <RefThisButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 1')).toBeInTheDocument();
    });

    test('Handle exceptions.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <ExceptionButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await wait();
      expect(screen.getByText('count is 1')).toBeInTheDocument();
    });
  });
  describe('async actions', () => {
    type State = { count: number };
    const { Provider, useContext } = createTinyContext<State>().actions({
      increment: async (state, amount: number) => {
        await wait10(); // wait for event loop
        return { count: state.count + amount };
      }
    });
    const IncrementButton = () => {
      const {
        actions: { increment }
      } = useContext();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const Display = () => {
      const {
        state: { count }
      } = useContext();
      return <>count is {count}</>;
    };

    test('Async action works.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await waitForElement(() => screen.getByText('count is 1'));
      expect(screen.getByText('count is 1')).toBeInTheDocument();
    });

    test('Async action is executed sequentially.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      fireEvent.click(screen.getByText('button'));
      await waitForElement(() => screen.getByText('count is 2'));
      expect(screen.getByText('count is 2')).toBeInTheDocument();
    });
  });

  describe('generator actions', () => {
    type State = { count: number };
    const { Provider, useContext } = createTinyContext<State>().actions({
      iiincrement: async function*(state, amount: number) {
        await wait10();
        state = yield { ...state, count: state.count + amount };
        await wait10();
        state = yield { ...state, count: state.count + amount };
        await wait10();
        return { ...state, count: state.count + amount };
      }
    });
    const IncrementButton = () => {
      const {
        actions: { iiincrement }
      } = useContext();
      return <button onClick={() => iiincrement(1)}>button</button>;
    };
    const Display = () => {
      const {
        state: { count }
      } = useContext();
      return <>count is {count}</>;
    };

    test('generator action works.', async () => {
      render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(screen.getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(screen.getByText('button'));
      await waitForElement(() => screen.getByText('count is 1'));
      expect(screen.getByText('count is 1')).toBeInTheDocument();
      await waitForElement(() => screen.getByText('count is 2'));
      expect(screen.getByText('count is 2')).toBeInTheDocument();
      await waitForElement(() => screen.getByText('count is 3'));
      expect(screen.getByText('count is 3')).toBeInTheDocument();
    });
  });
});
