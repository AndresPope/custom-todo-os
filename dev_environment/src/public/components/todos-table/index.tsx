import React from 'react';
import { FormattedMessage } from '@osd/i18n/react';
import {
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiTitle,
  EuiPageContent,
  EuiButtonEmpty,
  EuiSpacer,
  EuiLoadingSpinner,
} from '@elastic/eui';
import AddTodo from '../add-todo';
import { TodosBacklog } from './todos-backlog';
import { useHistory } from 'react-router-dom';
import { useListBacklog } from '../../hooks/use-list-backlog';
import { RefetchButton } from '../refetch-button';

export const TodosTable = () => {
  const history = useHistory();
  const { todos, loading, refetch } = useListBacklog();

  if (loading) {
    return (
      <EuiPage>
        <EuiPageBody component="main">
          <EuiPageContent>
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <EuiLoadingSpinner size="xl" />
            </div>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }

  return (
    <EuiPage>
      <EuiPageBody component="main">
        <EuiPageContent>
          <EuiPageHeader>
            <EuiTitle>
              <h1>
                <FormattedMessage
                  id="customPlugin.todoBacklog.title"
                  defaultMessage="TO-DO Backlog"
                />
              </h1>
            </EuiTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EuiButtonEmpty onClick={() => history.push('/')} flush="right" size="s">
                <FormattedMessage
                  id="customPlugin.todoBacklog.viewDashboardButtonLabel"
                  defaultMessage="View Dashboard"
                />
              </EuiButtonEmpty>
              <RefetchButton refetch={refetch} />
              <AddTodo />
            </div>
          </EuiPageHeader>
          <EuiSpacer size="s" />
          <TodosBacklog todos={todos} onRefresh={refetch} />
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
