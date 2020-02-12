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

class Actions {
  showProgress(state: TodoState) {
    return { ...state, progress: true };
  }

  hideProgress(state: TodoState) {
    return { ...state, progress: false };
  }

  async *add(state: TodoState, todo: Todo) {
    state = yield this.showProgress(state);

    await wait(); // network delays...
    const todos = [...state.todos, todo];
    state = yield { ...state, todos };

    return this.hideProgress(state);
  }

  async update(state: TodoState, index: number, todo: Todo) {
    await wait(); // network delays...
    const todos = [...state.todos];
    todos[index] = todo;
    return { ...state, todos };
  }
}

const { Provider, useContext } = createTinyContext<TodoState>().actions(new Actions());

export const useTodoContext = useContext;

export const TodoProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider value={{ todos: [], progress: false }}>{children}</Provider>
);
