import React from 'react';
import { useTodoContext, Todo } from './TodoProvider';

export const TodoList = () => {
  const {
    state: { todos },
    actions: { update, showProgress, hideProgress }
  } = useTodoContext();
  const onCheckd = async (i: number, todo: Todo, checked: boolean) => {
    await showProgress();
    await update(i, { ...todo, completed: checked });
    await hideProgress();
  };

  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i}>
          <span style={{ textDecoration: todo.completed ? 'line-through' : '' }}>{todo.text}</span>
          <input type="checkbox" checked={todo.completed} onChange={e => onCheckd(i, todo, e.target.checked)} />
        </li>
      ))}
    </ul>
  );
};
