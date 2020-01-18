import React from 'react';
import { TodoProvider } from './TodoProvider';
import { AdditionalForm } from './AdditionalForm';
import { TodoList } from './TodoList';

const TodoApp = () => {
  return (
    <TodoProvider>
      <div>
        <AdditionalForm />
        <TodoList />
      </div>
    </TodoProvider>
  );
};

export default TodoApp;
