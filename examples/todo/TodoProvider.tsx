import React from 'react';
import { wait } from '../wait';
import { createTinyContext } from '../../src/tiny-context';

export interface Todo {
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  progress: boolean;
}

export interface TodoActions {
  showProgress: () => void;
  hideProgress: () => void;
  add: (todo: Todo) => Promise<void>;
  update: (index: number, todo: Todo) => Promise<void>;
}

const { Provider, useContext } = createTinyContext<TodoState, TodoActions>({
  showProgress: state => ({ ...state, progress: true }),
  hideProgress: state => ({ ...state, progress: false }),
  add: async function*(state, todo) {
    state = yield { ...state, progress: true };

    await wait(); // network delays...
    const todos = [...state.todos, todo];
    state = yield { ...state, todos };

    return { ...state, progress: false };
  },
  update: async (state, index, todo) => {
    await wait(); // network delays...
    const todos = [...state.todos];
    todos[index] = todo;
    return { ...state, todos };
  }
});

export const useTodoContext = useContext;

export const TodoProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <Provider value={{ todos: [], progress: false }}>{children}</Provider>;
};
