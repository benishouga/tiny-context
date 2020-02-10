import React from 'react';
declare type Action = (...args: any) => void | Promise<void>;
declare type Actions<A> = {
    [P in keyof A]: Action;
};
declare type ContextState<S, A> = {
    state: S;
    actions: A;
};
declare type ActionResult<S> = void | S | Promise<void> | Promise<S>;
declare type GeneratorResult<S> = Generator<ActionResult<S>, ActionResult<S>, S> | AsyncGenerator<ActionResult<S>, ActionResult<S>, S>;
declare type InternalActionResult<S> = ActionResult<S> | GeneratorResult<S>;
export declare type InternalActions<S, A extends Actions<A>> = {
    [P in keyof A]: (state: S, ...args: Parameters<A[P]>) => InternalActionResult<S>;
};
declare type ExcludeFirstParameters<T extends (...args: any) => any> = T extends (s: any, ...args: infer P) => any ? P : never;
export declare type ExternalActions<A extends {
    [P in keyof A]: (...args: any) => any;
}> = {
    [P in keyof A]: (...args: ExcludeFirstParameters<A[P]>) => void | Promise<void>;
};
export declare function createStore<S, A extends Actions<A>>(value: S, onStateChanged: (s: S) => void, actions: InternalActions<S, A>): () => ContextState<S, A>;
export declare function createTinyContext<S, A extends Actions<A>>(internalActions: InternalActions<S, A>): {
    Provider: ({ value, children }: {
        value: S;
        children: React.ReactNode;
    }) => JSX.Element;
    useContext: () => ContextState<S, A>;
};
export {};
