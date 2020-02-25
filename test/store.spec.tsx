import { Store } from '../src/tiny-context';
describe('Store', () => {
  test('simple action', async () => {
    type State = { count: number };
    const store = new Store({ count: 0 }, { increment: (state: State) => ({ count: state.count + 1 }) });
    const { increment } = store.actions;
    await increment();
    const { count } = store.state;
    expect(count).toBe(1);
  });
});
