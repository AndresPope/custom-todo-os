import React from 'react';
import { EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import { ITodo } from '../../types';
import { TodoItem } from './todo-item';

type Props = {
  title: React.ReactNode;
  todos: Array<ITodo>;
};

export const TodoPreviewList = ({ title, todos }: Props) => {
  if (todos.length === 0) {
    return (
      <EuiPanel
        style={{
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EuiTitle size="s">
          <h3>{title}</h3>
        </EuiTitle>
        <EuiSpacer size="m" />
        <p>No TO-DOs available</p>
      </EuiPanel>
    );
  }

  return (
    <EuiPanel style={{ height: '100%', overflow: 'auto' }}>
      <h3>{title}</h3>
      <EuiSpacer size="m" />
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </EuiPanel>
  );
};
