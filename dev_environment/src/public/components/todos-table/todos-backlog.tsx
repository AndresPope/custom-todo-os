import React, { useMemo, useState } from 'react';
import { EuiInMemoryTable, EuiConfirmModal } from '@elastic/eui';

import { getTableColumns } from './table-columns';
import { ITodo } from '../../types';
import { EditTodoModal } from './edit-todo-modal';
import { useAPI, useNotification } from '../../context';

type Props = {
  todos: Array<ITodo>;
  onRefresh: () => void;
};

export const TodosBacklog = ({ todos, onRefresh }: Props) => {
  const [todoToEdit, setTodoToEdit] = useState<ITodo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const apiService = useAPI();
  const toasts = useNotification();

  const handleComplete = async (id: string) => {
    try {
      await apiService.completeTodo(id);
      toasts.addSuccess('TODO marked as completed');
      onRefresh();
    } catch (error) {
      toasts.addDanger('Error completing TODO');
    }
  };

  const handleEdit = (todo: ITodo) => {
    setTodoToEdit(todo);
  };

  const handleUpdate = async (id: string, updates: any) => {
    try {
      await apiService.updateTodo(id, updates);
      toasts.addSuccess('TODO updated successfully');
      setTodoToEdit(null);
      onRefresh();
    } catch (error) {
      toasts.addDanger('Error updating TODO');
    }
  };

  const handleDelete = async () => {
    if (!todoToDelete) return;
    try {
      await apiService.deleteTodo(todoToDelete);
      toasts.addSuccess('TODO deleted successfully');
      setTodoToDelete(null);
      onRefresh();
    } catch (error) {
      toasts.addDanger('Error deleting TODO');
    }
  };

  const columns = useMemo(
    () =>
      getTableColumns({
        onComplete: handleComplete,
        onEdit: handleEdit,
        onDelete: (id: string) => setTodoToDelete(id),
      }),
    []
  );

  const search = {
    box: {
      incremental: true,
      placeholder: 'Search tasks...',
    },
    filters: [
      {
        type: 'field_value_selection' as const,
        field: 'state',
        name: 'Status',
        multiSelect: 'or' as const,
        options: [
          { value: 'planned', name: 'Planned' },
          { value: 'completed', name: 'Completed' },
          { value: 'completed_with_errors', name: 'With Errors' },
        ],
      },
      {
        type: 'field_value_selection' as const,
        field: 'priority',
        name: 'Priority',
        multiSelect: 'or' as const,
        options: [
          { value: 1, name: 'Urgent' },
          { value: 2, name: 'High' },
          { value: 3, name: 'Medium' },
          { value: 4, name: 'Low' },
        ],
      },
      {
        type: 'field_value_selection' as const,
        field: 'owner',
        name: 'Owner',
        multiSelect: 'or' as const,
        options: [
          { value: 'john.doe', name: 'John Doe' },
          { value: 'jane.smith', name: 'Jane Smith' },
          { value: 'admin', name: 'Admin' },
          { value: 'security.team', name: 'Security Team' },
          { value: 'compliance.officer', name: 'Compliance Officer' },
        ],
      },
    ],
  };

  const pagination = {
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 20],
  };

  const sorting = {
    sort: {
      field: 'priority',
      direction: 'asc' as const,
    },
  };

  return (
    <>
      <EuiInMemoryTable
        items={todos}
        columns={columns}
        search={search}
        pagination={pagination}
        sorting={sorting}
        tableLayout="auto"
      />

      {todoToEdit && (
        <EditTodoModal
          todo={todoToEdit}
          onClose={() => setTodoToEdit(null)}
          onSave={handleUpdate}
        />
      )}

      {todoToDelete && (
        <EuiConfirmModal
          title="Delete TODO"
          onCancel={() => setTodoToDelete(null)}
          onConfirm={handleDelete}
          cancelButtonText="Cancel"
          confirmButtonText="Delete"
          buttonColor="danger"
        >
          <p>Are you sure you want to delete this TODO? This action cannot be undone.</p>
        </EuiConfirmModal>
      )}
    </>
  );
};
