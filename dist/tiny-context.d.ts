import React from 'react';
declare type Action = (...args: any) => void | Promise<void>;
declare type Actions<A> = {
    [P in keyof A]: Action;
};
declare type InternalActionResult<S> = ActionResult<S> | GeneratorResult<S>;
declare type ActionResult<S> = void | S | Promise<void> | Promise<S>;
declare type GeneratorResult<S> = Generator<ActionResult<S>, ActionResult<S>> | AsyncGenerator<ActionResult<S>, ActionResult<S>>;
export declare type InternalActions<S, A extends Actions<A>> = {
    [P in keyof A]: (state: S, ...args: Parameters<A[P]>) => InternalActionResult<S>;
};
export declare function createTinyContext<S, A extends Actions<A>>(actions: InternalActions<S, A>): {
    Provider: ({ value, children }: {
        value: S;
        children: React.ReactNode;
    }) => JSX.Element;
    useContext: () => {
        state: S;
        actions: A;
    };
};
export {};
