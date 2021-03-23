import React from 'react';
import { connect } from '../../src/tiny-context';

export interface Todo {
  text: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
}

class Actions {
  add(state: TodoState, todo: Todo) {
    state.todos.push(todo);
  }

  update(state: TodoState, index: number, todo: Todo) {
    state.todos[index] = todo;
  }
}

const { Provider, useContext } = connect<TodoState>().to(new Actions());

export const useTodoContext = useContext;

export const TodoProvider = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <Provider value={{ todos: [] }}>{children}</Provider>
);
