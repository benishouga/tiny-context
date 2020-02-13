import { PropsWithChildren, FC } from 'react';
declare type Result<S> = void | S | Promise<void> | Promise<S>;
declare type GeneratorResult<S> = Generator<Result<S>, Result<S>, S> | AsyncGenerator<Result<S>, Result<S>, S>;
declare type ImplResult<S> = Result<S> | GeneratorResult<S>;
declare type Impl<S, A> = {
    [P in keyof A]: (s: S, ...args: any) => ImplResult<S>;
};
declare type ToExternalParameter<T> = T extends (s: any, ...args: infer P) => any ? P : never;
declare type Externals<A> = {
    [P in keyof A]: (...args: ToExternalParameter<A[P]>) => void | Promise<void>;
};
declare type ContextState<S, A> = {
    state: S;
    actions: Externals<A>;
};
export declare function createStore<S, A extends Impl<S, A>>(value: S, onChanged: (s: S) => void, actions: A): () => ContextState<S, A>;
declare type CreateResult<S, A> = {
    Provider: FC<PropsWithChildren<{
        value: S;
    }>>;
    useContext: () => ContextState<S, A>;
};
declare type Fluent<S> = {
    actions: <A extends Impl<S, A>>(impl: A) => CreateResult<S, A>;
};
declare function _createTinyContext<S>(): Fluent<S>;
declare function _createTinyContext<S, A extends Impl<S, A>>(impl: A): CreateResult<S, A>;
export declare const createTinyContext: typeof _createTinyContext;
export {};
