import React from 'react';
import { useTodoContext, Todo } from './TodoProvider';

export const TodoList = (): JSX.Element => {
  const {
    state: { todos },
    actions: { update },
  } = useTodoContext();

  const onChange = (i: number, todo: Todo, checked: boolean) => {
    update(i, { ...todo, completed: checked });
  };

  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i}>
          <input
            id={`${i}_check`}
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => onChange(i, todo, e.target.checked)}
          />
          <label htmlFor={`${i}_check`}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : '' }}>{todo.text}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};
