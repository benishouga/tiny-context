import React from 'react';
import { useTodoContext } from './TodoProvider';

export const TodoList = () => {
  const {
    state: { todos },
    actions: { update }
  } = useTodoContext();
  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i}>
          <span style={{ textDecoration: todo.completed ? 'line-through' : '' }}>{todo.text}</span>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={e => update(i, { ...todo, completed: e.target.checked })}
          />
        </li>
      ))}
    </ul>
  );
};
