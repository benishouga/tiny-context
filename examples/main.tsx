import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './todo/TodoApp';
import { AsyncApp } from './async/AsyncApp';
import { GeneratorApp } from './generator/GeneratorApp';
import { MinimumApp } from './minimum/MinimumApp';
import { ClassBasedApp } from './class-based/ClassBasedApp';
import { CodePreviewer } from './CodePreviewer';
import { CancelApp } from './cancel/CancelApp';

ReactDOM.render(
  <>
    <a href="https://github.com/benishouga/tiny-context">https://github.com/benishouga/tiny-context</a>
    <hr />
    <MinimumApp />
    <CodePreviewer name="MinimumApp.tsx" code={require('!!raw-loader!./minimum/MinimumApp.tsx').default} />
    <hr />
    <ClassBasedApp />
    <CodePreviewer name="ClassBasedApp.tsx" code={require('!!raw-loader!./class-based/ClassBasedApp.tsx').default} />
    <hr />
    <AsyncApp />
    <CodePreviewer name="AsyncApp.tsx" code={require('!!raw-loader!./async/AsyncApp.tsx').default} />
    <hr />
    <CancelApp />
    <CodePreviewer name="CancelApp.tsx" code={require('!!raw-loader!./cancel/CancelApp.tsx').default} />
    <hr />
    <GeneratorApp />
    <CodePreviewer name="GeneratorApp.tsx" code={require('!!raw-loader!./generator/GeneratorApp.tsx').default} />
    <hr />
    <TodoApp />
    <CodePreviewer name="TodoApp.tsx" code={require('!!raw-loader!./todo/TodoApp.tsx').default} />
    <CodePreviewer name="TodoProvider.tsx" code={require('!!raw-loader!./todo/TodoProvider.tsx').default} />
    <CodePreviewer name="AdditionalForm.tsx" code={require('!!raw-loader!./todo/AdditionalForm.tsx').default} />
    <CodePreviewer name="TodoList.tsx" code={require('!!raw-loader!./todo/TodoList.tsx').default} />
  </>,
  document.getElementById('root')
);
