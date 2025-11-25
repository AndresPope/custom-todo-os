import React from 'react';
import { EuiBadge, EuiHealth, EuiButtonIcon, EuiToolTip } from '@elastic/eui';
import { ITodo } from '../../types';

const priorityLabel: { [x: number]: { label: string; color: string } } = {
  1: { label: 'Urgent', color: 'danger' },
  2: { label: 'High', color: 'warning' },
  3: { label: 'Medium', color: 'primary' },
  4: { label: 'Low', color: 'default' },
};

const todoState: { [x: string]: { label: string; color: string } } = {
  completed: { label: 'Completed', color: 'success' },
  planned: { label: 'Planned', color: 'primary' },
  completed_with_errors: { label: 'With Errors', color: 'danger' },
};

type TableColumnsCallbacks = {
  onComplete: (id: string) => void;
  onEdit: (todo: ITodo) => void;
  onDelete: (id: string) => void;
};

export const getTableColumns = (callbacks: TableColumnsCallbacks) => [
  {
    field: 'name',
    name: 'Task',
    sortable: true,
    truncateText: true,
  },
  {
    field: 'state',
    name: 'Status',
    sortable: true,
    render: (state: string) => {
      const { label, color } = todoState[state] || { label: 'Unknown', color: 'default' };
      return <EuiHealth color={color}>{label}</EuiHealth>;
    },
  },
  {
    field: 'priority',
    name: 'Priority',
    sortable: true,
    render: (priority: number) => {
      const { label, color } = priorityLabel[priority] || { label: 'Unknown', color: 'default' };
      return <EuiBadge color={color}>{label}</EuiBadge>;
    },
  },
  {
    field: 'owner',
    name: 'Owner',
    sortable: true,
  },
  {
    field: 'plannedStartDate',
    name: 'Due Date',
    sortable: true,
    render: (date: Date | null) => (date ? date.toLocaleDateString() : '-'),
  },
  {
    field: 'createdAt',
    name: 'Created',
    sortable: true,
    render: (date: Date) => date.toLocaleDateString(),
  },
  {
    name: 'Actions',
    actions: [
      {
        render: (item: ITodo) => (
          <EuiToolTip content="Mark as completed">
            <EuiButtonIcon
              iconType="check"
              aria-label="Complete"
              color="success"
              disabled={item.state === 'completed'}
              onClick={() => callbacks.onComplete(item.id)}
            />
          </EuiToolTip>
        ),
      },
      {
        render: (item: ITodo) => (
          <EuiToolTip content="Edit task">
            <EuiButtonIcon
              iconType="pencil"
              aria-label="Edit"
              onClick={() => callbacks.onEdit(item)}
            />
          </EuiToolTip>
        ),
      },
      {
        render: (item: ITodo) => (
          <EuiToolTip content="Delete task">
            <EuiButtonIcon
              iconType="trash"
              aria-label="Delete"
              color="danger"
              onClick={() => callbacks.onDelete(item.id)}
            />
          </EuiToolTip>
        ),
      },
    ],
  },
];
