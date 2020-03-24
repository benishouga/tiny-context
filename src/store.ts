type Result<S> = void | S | Promise<void> | Promise<S>;
type GeneratorResult<S> = Generator<Result<S>, Result<S>, S> | AsyncGenerator<Result<S>, Result<S>, S>;
type ImplResult<S> = Result<S> | GeneratorResult<S>;

export type Impl<S, A> = { [P in keyof A]: A[P] extends Function ? (s: S, ...args: any) => ImplResult<S> : any };

type ToExternalParameter<T> = T extends (s: any, ...args: infer P) => any ? P : never;
type FunctionOnly<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>;
type ToExternalFunctoins<A> = { [P in keyof A]: (...args: ToExternalParameter<A[P]>) => Promise<void> };
export type Externals<A> = ToExternalFunctoins<FunctionOnly<A>>;

function isGenerator<S>(obj: any): obj is GeneratorResult<S> {
  return obj && typeof obj.next === 'function' && typeof obj.throw === 'function' && typeof obj.return === 'function';
}

let ignores: string[] = [];
const extract = (obj: object) => {
  let t = obj;
  const set = new Set<string>();
  while (t) {
    Object.getOwnPropertyNames(t)
      .filter((n) => typeof (t as any)[n] === 'function' && !ignores.includes(n))
      .forEach((n) => set.add(n));
    t = Object.getPrototypeOf(t);
  }
  return Array.from(set);
};
ignores = extract({});

type Task = () => Promise<void>;
class Queue {
  private q: Task[] = [];

  push(task: Task) {
    const free = !this.q.length;
    this.q.push(task);
    if (free) this.awake();
  }

  awake() {
    this.q[0]?.().finally(() => {
      this.q.shift();
      this.awake();
    });
  }
}

type Listener<S> = (s: S) => void;
/**
 * Class for managing the `State`.
 *
 * Given a `State` and `Actions` to change `State`, `Actions` are sequenced to prevent invalid `State`.
 *
 * @template S `State` to managed.
 * @template A `Actions` to change `State`.
 *   `Actions` implementation methods require the first argument to be `State` and the return value to be `State` (or [`Promise`, `Async Generator`](https://benishouga.github.io/tiny-context/)).
 */
export class Store<S, A extends Impl<S, A>> {
  private queue = new Queue();
  private listeners: Listener<S>[] = [];
  /**
   * @param state Initial `State`.
   * @param impl `Actions` to change `State`.
   */
  constructor(private _state: S, impl: A) {
    this.actions = this.convertToExternals(impl);
  }
  /** Current `State`. */
  public get state() {
    return this._state;
  }
  /**
   * `Actions` to change `State`.
   *
   * Function arguments are inherited from the second and subsequent arguments of the previously defined Action. The return value is a uniform `Promise<void>`.
   */
  public readonly actions: Externals<A>;
  /**
   * Adds a change listener.
   * @returns this
   */
  public onChanged(listener: Listener<S>) {
    this.listeners.push(listener);
    return this;
  }
  private feed(newState: void | S) {
    if (newState !== null && newState !== undefined) {
      this._state = { ...newState };
      this.listeners.forEach((listener) => listener(this._state));
    }
  }
  private convertToExternals(impl: A) {
    const external: { [name: string]: (...args: any) => void | Promise<void> } = {};
    extract(impl).forEach((name) => (external[name] = this.convert((impl as any)[name].bind(impl))));
    return external as Externals<A>;
  }
  private convert(action: (state: S, ...args: any) => ImplResult<S>) {
    const passToImpl = async (args: any) => {
      const result = await action(this._state, ...args);
      if (isGenerator<Result<S>>(result)) {
        let more = true;
        while (more) {
          const next = await result.next(this._state);
          this.feed(await next.value);
          more = !next.done;
        }
      } else {
        this.feed(result);
      }
    };
    return (...args: any) =>
      new Promise<void>((resolve, reject) =>
        this.queue.push(async () => {
          await passToImpl(args).then(resolve).catch(reject);
        })
      );
  }
}
