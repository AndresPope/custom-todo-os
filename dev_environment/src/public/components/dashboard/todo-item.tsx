import React from 'react';
import { EuiPanel, EuiCheckbox } from '@elastic/eui';
import { ITodo } from '../../types';
import { useCompleteTodo } from '../../hooks/use-complete-todo';
import { _EuiPanelProps } from '@elastic/eui/src/components/panel/panel';
import { useNotification } from '../../context';

const priorityColor: { [key: number]: _EuiPanelProps['color'] } = {
  1: 'danger',
  2: 'warning',
  3: 'primary',
};

export const TodoItem = ({ todo }: { todo: ITodo }) => {
  const { completeTodo } = useCompleteTodo({ id: todo.id });
  const [completed, setCompleted] = React.useState(
    todo.state === 'completed' || todo.state === 'completed_with_errors'
  );
  const toasts = useNotification();

  const handleChange = async () => {
    try {
      setCompleted(!completed);
      await completeTodo();
      toasts.addSuccess('TO-DO created successfully');
    } catch (e) {
      toasts.addDanger('Error completing TO-DO');
      console.error('Error completing todo:', e);
    }
  };

  return (
    <EuiPanel
      key={todo.id}
      paddingSize="s"
      color={priorityColor[todo.priority]}
      style={{ marginBottom: '10px', opacity: completed ? 0.6 : 1 }}
    >
      <div>
        <EuiCheckbox
          id={todo.id}
          label={todo.name}
          disabled={todo.state === 'completed' || todo.state === 'completed_with_errors'}
          checked={completed}
          onChange={handleChange}
        />
      </div>
    </EuiPanel>
  );
};
