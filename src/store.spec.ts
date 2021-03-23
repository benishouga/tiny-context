import { Store } from './tiny-context';

describe('Store', () => {
  test('Call simply', () => {
    type State = { count: number };
    const store = new Store(
      { count: 0 },
      {
        increment: (state: State, amount: number) => {
          state.count += amount;
        },
      }
    );
    const spy = jest.fn();
    store.onChanged(spy);
    const { increment } = store.actions;
    {
      const { count } = increment(1);
      expect(count).toBe(1);
    }
    {
      const { count } = store.state;
      expect(count).toBe(1);
    }
    {
      const { count } = increment(2);
      expect(count).toBe(3);
    }
    {
      const { count } = store.state;
      expect(count).toBe(3);
    }
    expect(spy).toBeCalledTimes(2);
  });
  test('Action is not updated if it does not return a value', () => {
    const store = new Store({}, { doNothing: () => {} });
    const { doNothing } = store.actions;
    const prev = store.state;
    doNothing();
    expect(store.state).toBe(prev);
  });

  test('class-based', () => {
    type State = { count: number };
    class Actions {
      v1 = 0;
      v2 = '0';
      v3 = false;
      increment(state: State, amount: number) {
        state.count += amount;
      }
    }
    const store = new Store({ count: 0 }, new Actions());
    const { increment } = store.actions;
    increment(1);
    const { count } = store.state;
    expect(count).toBe(1);
  });

  test('Can refer to This in Action.', () => {
    type State = { count: number };
    class Actions {
      increment(state: State, amount: number) {
        this._increment(state, amount);
      }
      _increment(state: State, amount: number) {
        state.count += amount;
      }
    }
    const store = new Store({ count: 0 }, new Actions());
    const { increment } = store.actions;
    increment(1);
    const { count } = store.state;
    expect(count).toBe(1);
  });

  test('Handle exceptions.', () => {
    class Actions {
      throwException() {
        throw new Error('hoge');
      }
    }
    const store = new Store({ count: 0 }, new Actions());
    const { throwException } = store.actions;
    expect(() => {
      throwException();
    }).toThrow();
  });
});
