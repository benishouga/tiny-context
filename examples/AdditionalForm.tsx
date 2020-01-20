import React, { useState } from 'react';
import { useTodoContext } from './TodoProvider';

export const AdditionalForm = () => {
  const {
    state: { progress },
    actions: { add, showProgress, hideProgress }
  } = useTodoContext();

  const [text, setText] = useState('');

  const onAddClick = async () => {
    if (!text) {
      return;
    }
    await showProgress();
    await add({ text, completed: false });
    await hideProgress();
    setText('');
  };

  return (
    <div>
      <input disabled={progress} type="text" value={text} onChange={e => setText(e.target.value)} />
      <button disabled={progress} onClick={onAddClick}>
        add
      </button>
      {progress ? 'Now processing...' : ''}
    </div>
  );
};
