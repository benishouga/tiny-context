import React from 'react';
import { TodoProvider } from './TodoProvider';
import { AdditionalForm } from './AdditionalForm';
import { TodoList } from './TodoList';

const TodoApp = (): JSX.Element => {
  return (
    <TodoProvider>
      <p>TodoApp</p>
      <AdditionalForm />
      <TodoList />
    </TodoProvider>
  );
};

export default TodoApp;
