import React, { useState } from 'react';
import { useTodoContext } from './TodoProvider';

export const AdditionalForm = (): JSX.Element => {
  const {
    actions: { add },
  } = useTodoContext();
  const [text, setText] = useState('');

  const onAddClick = () => {
    if (!text) {
      return;
    }
    add({ text, completed: false });
    setText('');
  };

  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={onAddClick}>add</button>
    </div>
  );
};
