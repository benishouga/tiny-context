import React from 'react';
declare type Action<S> = (...args: any) => Promise<void> | Promise<S>;
declare type Actions<S, A> = {
    [P in keyof A]: Action<S>;
};
export declare type InternalActions<S, A extends Actions<S, A>> = {
    [P in keyof A]: (state: Readonly<S>, ...args: Parameters<A[P]>) => void | Readonly<S> | Promise<void> | Promise<Readonly<S>>;
};
export declare function createTinyContext<S, A extends Actions<S, A>>(internalActions: InternalActions<S, A>): {
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
