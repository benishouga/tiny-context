import React from 'react';
import { createTinyContext } from '../src/tiny-context';

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
  showProgress: state => ({ ...state, progress: true }),
  hideProgress: state => ({ ...state, progress: false }),
  add: async (state, todo) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // network
    state.todos.push(todo);
    return state;
  },
  update: async (state, index, todo) => {
    state.todos[index] = todo;
    return state;
  }
});

export const useTodoContext = useContext;

export const TodoProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <Provider value={{ todos: [], progress: false }}>{children}</Provider>;
};
