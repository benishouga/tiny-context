import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, screen, wait, waitForElement } from '@testing-library/react';

import { createTinyContext } from '../src';

const wait10 = async () => new Promise(resolve => setTimeout(resolve, 10));

describe('tiny-context', () => {
  describe('simple actions', () => {
    type State = { count: number };
    const { Provider, useContext } = createTinyContext<State>().actions({
      increment: (state, amount: number) => ({ count: state.count + amount })
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

    test('Provider does not throw an error if no children.', async () => {
      render(<Provider value={{ count: 0 }} />);
      expect(true).toBeTruthy();
    });
  });

  describe('class based actions', () => {
    type State = { count: number };
    class Actions {
      increment(state: State, amount: number) {
        return { count: state.count + amount };
      }
    }
    const { Provider, useContext } = createTinyContext<State, Actions>(new Actions());
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
});
