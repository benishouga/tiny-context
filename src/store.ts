import { produce } from 'immer';
import { Draft } from 'immer/dist/types/types-external';

type Action<S> = (s: Draft<S>, ...args: any) => void;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Impl<S, A> = { [P in keyof A]: A[P] extends Function ? Action<S> : any };

type ToExternalParameter<T> = T extends (s: any, ...args: infer P) => any ? P : never;
// eslint-disable-next-line @typescript-eslint/ban-types
type FunctionOnly<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>;
type ToExternalFunctoins<S, A> = { [P in keyof A]: (...args: ToExternalParameter<A[P]>) => S };
export type Externals<S, A> = ToExternalFunctoins<S, FunctionOnly<A>>;

let ignores: string[] = [];
const extract = (obj: Record<string, unknown>) => {
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

type Listener<S> = (s: S) => void;
/**
 * Class for managing the `State`.
 *
 * Given a `State` and `Actions` to change `State`, `Actions` are sequenced to prevent invalid `State`.
 *
 * @template S `State` to managed.
 * @template A `Actions` to change `State`.
 *   `Actions` implementation methods require the first argument to be Immer's Draft<`State`>
 */
export class Store<S, A extends Impl<S, A>> {
  private listeners: Listener<S>[] = [];
  /**
   * @param state Initial `State`.
   * @param impl `Actions` to change `State`.
   */
  constructor(private _state: S, impl: A) {
    this.actions = this.convertToExternals(impl);
  }
  /** Current `State`. */
  public get state(): S {
    return this._state;
  }
  /**
   * `Actions` to change `State`.
   *
   * Function arguments are inherited from the second and subsequent arguments of the previously defined Action..
   */
  public readonly actions: Externals<S, A>;
  /**
   * Adds a change listener.
   * @returns this
   */
  public onChanged(listener: Listener<S>): this {
    this.listeners.push(listener);
    return this;
  }
  private feed(newState: S) {
    this._state = newState;
    // TODO: Need to block recursive call ?
    this.listeners.forEach((listener) => listener(newState));
    return newState;
  }

  private convertToExternals(impl: A) {
    const external: any = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    extract(impl).forEach((name) => (external[name] = this.convert((impl as any)[name].bind(impl))));
    return external as Externals<S, A>;
  }
  private convert(action: Action<S>) {
    return (...args: any): S => this.feed(produce(this._state, (draft) => action(draft, ...args)));
  }
}
