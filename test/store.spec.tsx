import { Store } from '../src/tiny-context';

const wait = async (number = 10) => new Promise(resolve => setTimeout(resolve, number));
const waitFor = async (condition: () => boolean, timeout = 50) => {
  const start = new Date().getTime();
  let done = false;
  while (!done) {
    await wait(0);
    done = condition();
    if (timeout < new Date().getTime() - start) {
      throw Error('timeout');
    }
  }
};

describe('Store', () => {
  test('Call simply', async () => {
    type State = { count: number };
    const store = new Store(
      { count: 0 },
      { increment: (state: State, amount: number) => ({ count: state.count + amount }) }
    );
    const spy = jest.fn();
    store.onChanged(spy);
    const { increment } = store.actions;
    await increment(1);
    {
      const { count } = store.state;
      expect(count).toBe(1);
    }
    await increment(2);
    {
      const { count } = store.state;
      expect(count).toBe(3);
    }
    expect(spy).toBeCalledTimes(2);
  });
  test('Action is not updated if it does not return a value', async () => {
    const store = new Store({}, { doNothing: () => {} });
    const { doNothing } = store.actions;
    const prev = store.state;
    await doNothing();
    expect(store.state).toBe(prev);
  });

  test('class-based', async () => {
    type State = { count: number };
    class Actions {
      v1 = 0;
      v2 = '0';
      v3 = false;
      increment(state: State, amount: number) {
        return { count: state.count + amount };
      }
    }
    const store = new Store({ count: 0 }, new Actions());
    const { increment } = store.actions;
    await increment(1);
    const { count } = store.state;
    expect(count).toBe(1);
  });

  test('async action', async () => {
    type State = { count: number };
    class Actions {
      async increment(state: State, amount: number) {
        await wait();
        return { count: state.count + amount };
      }
    }
    const store = new Store({ count: 0 }, new Actions());
    const { increment } = store.actions;
    await increment(1);
    const { count } = store.state;
    expect(count).toBe(1);
  });

  test('Can refer to This in Action.', async () => {
    type State = { count: number };
    class Actions {
      increment(state: State, amount: number) {
        return this._increment(state, amount);
      }
      _increment(state: State, amount: number) {
        return { count: state.count + amount };
      }
    }
    const store = new Store({ count: 0 }, new Actions());
    const { increment } = store.actions;
    await increment(1);
    const { count } = store.state;
    expect(count).toBe(1);
  });

  test('Handle exceptions.', async () => {
    class Actions {
      throwException() {
        throw new Error('hoge');
      }
    }
    const store = new Store({ count: 0 }, new Actions());
    const { throwException } = store.actions;
    await expect(throwException()).rejects.toThrow();
  });

  test('generator action.', async () => {
    type State = { count: number };
    class Actions {
      async *iiincrement(state: State, amount: number) {
        await wait();
        state = yield { ...state, count: state.count + amount };
        await wait();
        state = yield { ...state, count: state.count + amount };
        await wait();
        return { ...state, count: state.count + amount };
      }
    }
    const spy = jest.fn();
    const store = new Store({ count: 0 }, new Actions());
    store.onChanged(spy);
    const { iiincrement } = store.actions;
    iiincrement(1);
    {
      await waitFor(() => store.state.count === 1);
      const { count } = store.state;
      expect(count).toBe(1);
    }
    {
      await waitFor(() => store.state.count === 2);
      const { count } = store.state;
      expect(count).toBe(2);
    }
    {
      await waitFor(() => store.state.count === 3);
      const { count } = store.state;
      expect(count).toBe(3);
    }
    expect(spy).toBeCalledTimes(3);
    const [[first], [second], [third]] = spy.mock.calls;
    expect(first.count).toBe(1);
    expect(second.count).toBe(2);
    expect(third.count).toBe(3);
  });
});
