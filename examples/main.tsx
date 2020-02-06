import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './todo/TodoApp';
import { AsyncApp } from './async/AsyncApp';
import { GeneratorApp } from './generator/GeneratorApp';
import { MinimumApp } from './minimum/MinimumApp';
import { ClassBasedApp } from './class-based/ClassBasedApp';

ReactDOM.render(
  <>
    <MinimumApp />
    <hr />
    <ClassBasedApp />
    <hr />
    <AsyncApp />
    <hr />
    <GeneratorApp />
    <hr />
    <TodoApp />
  </>,
  document.getElementById('root')
);
