import React from 'react';
import { createTinyContext } from '../tiny-context';
import { wait } from '../wait';

export interface Todo {
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  progress: boolean;
}

export interface TodoActions {
  showProgress: () => Promise<void>;
  hideProgress: () => Promise<void>;
  add: (todo: Todo) => Promise<void>;
  update: (index: number, todo: Todo) => Promise<void>;
}

const { Provider, useContext } = createTinyContext<TodoState, TodoActions>({
  showProgress: async state => ({ ...state, progress: true }),
  hideProgress: async state => ({ ...state, progress: false }),
  add: async (state, todo) => {
    await wait();
    state.todos.push(todo);
    return state;
  },
  update: async (state, index, todo) => {
    state.todos[index] = todo;
    return state;
  }
});

export const useTodoContext = useContext;

export const TodoProvider = ({ children }: { children: React.ReactChild }): JSX.Element => {
  return <Provider value={{ todos: [], progress: false }}>{children}</Provider>;
};
