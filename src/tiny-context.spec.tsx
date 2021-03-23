import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { connect } from '../src/tiny-context';

describe('tiny-context', () => {
  describe('simple actions', () => {
    type State = { count: number };
    const { Provider, useContext } = connect<State>().to({
      increment: (state, amount: number) => {
        state.count += amount;
      },
    });
    const IncrementButton = () => {
      const {
        actions: { increment },
      } = useContext();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const TwiceButton = () => {
      const {
        actions: { increment },
      } = useContext();
      return (
        <button
          onClick={() => {
            void increment(1);
            void increment(1);
          }}
        >
          button
        </button>
      );
    };
    const Display = () => {
      const {
        state: { count },
      } = useContext();
      return <>count is {count}</>;
    };

    test('connect-to can create a Provider and useContext instance.', () => {
      const { Provider, useContext } = connect<Record<string, unknown>>().to({});
      expect(Provider).toBeDefined();
      expect(useContext).toBeDefined();
    });

    test('Update the State using an action.', async () => {
      const { getByText, findByText } = render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 1')).toBeDefined();
    });

    test('Action is executed sequentially when double-clicked.', async () => {
      const { getByText, findByText } = render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 2')).toBeDefined();
    });

    test('Action is executed sequentially when the action is called twice on the same event loop.', async () => {
      const { getByText, findByText } = render(
        <Provider value={{ count: 0 }}>
          <TwiceButton />
          <Display />
        </Provider>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 2')).toBeDefined();
    });

    test('Provider does not throw an error if no children.', () => {
      render(<Provider value={{ count: 0 }} />);
      expect(true).toBeTruthy();
    });
  });

  describe('class based actions', () => {
    type State = { count: number };
    class Actions {
      increment(state: State, amount: number) {
        state.count += amount;
      }
    }
    const { Provider, useContext } = connect<State>().to(new Actions());
    const IncrementButton = () => {
      const {
        actions: { increment },
      } = useContext();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const Display = () => {
      const {
        state: { count },
      } = useContext();
      return <>count is {count}</>;
    };

    test('Actions work even if made based on Class.', async () => {
      const { getByText, findByText } = render(
        <Provider value={{ count: 0 }}>
          <IncrementButton />
          <Display />
        </Provider>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 1')).toBeDefined();
    });
  });
});
