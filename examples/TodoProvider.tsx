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
  showProgress: () => void;
  hideProgress: () => void;
  add: (todo: Todo) => Promise<void>;
  update: (index: number, todo: Todo) => Promise<void>;
}

const { Provider, useContext } = createTinyContext<TodoState, TodoActions>({
  showProgress: state => ({ ...state, progress: true }),
  hideProgress: state => ({ ...state, progress: false }),
  add: function*(state, todo) {
    state.progress = true;
    yield state;

    yield new Promise<TodoState>(resolve =>
      setTimeout(() => {
        const todos = [...state.todos, todo];
        state.todos = todos;
        resolve(state);
      }, 500)
    );

    state.progress = false;
    return state;
  },
  update: async (state, index, todo) => {
    await new Promise<TodoState>(resolve => setTimeout(resolve, 500));
    const todos = [...state.todos];
    todos[index] = todo;
    return { ...state, todos };
  }
});

export const useTodoContext = useContext;

export const TodoProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <Provider value={{ todos: [], progress: false }}>{children}</Provider>;
};
