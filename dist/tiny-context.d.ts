import React from 'react';
declare type Action = (...args: any) => void | Promise<void>;
declare type Actions<A> = {
    [P in keyof A]: Action;
};
declare type InternalActionResult<S> = void | Readonly<S> | Promise<void> | Promise<Readonly<S>>;
export declare type InternalActions<S, A extends Actions<A>> = {
    [P in keyof A]: (state: Readonly<S>, ...args: Parameters<A[P]>) => InternalActionResult<S>;
};
export declare function createTinyContext<S, A extends Actions<A>>(internalActions: InternalActions<S, A>): {
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
