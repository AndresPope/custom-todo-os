import React from 'react';
import {
  EuiPageContent,
  EuiPageHeader,
  EuiSpacer,
  EuiPage,
  EuiPageBody,
  EuiButtonEmpty,
  EuiLoadingSpinner,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import { TodoPreviewList } from './todo-preview-list';
import AddTodo from '../add-todo';
import { TodosCharts } from './todos-charts';
import { useListDashboardTodos } from '../../hooks/use-list-dashboard-todos';
import { RefetchButton } from '../refetch-button';

export const TodosDashboard = () => {
  const history = useHistory();
  const {
    loading,
    allTodos,
    pendingTodos,
    todaysTodos,
    nextTodos,
    refetch,
  } = useListDashboardTodos();

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
                  id="customPlugin.todosDashboard.title"
                  defaultMessage="TO-DO Dashboard"
                />
              </h1>
            </EuiTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EuiButtonEmpty onClick={() => history.push('/backlog')} size="s">
                <FormattedMessage
                  id="customPlugin.todosDashboard.viewAllButtonLabel"
                  defaultMessage="View All TO-DOs"
                />
              </EuiButtonEmpty>
              <RefetchButton refetch={refetch} />
              <AddTodo />
            </div>
          </EuiPageHeader>
          <EuiSpacer size="s" />
          <EuiFlexGroup responsive style={{ height: '400px' }}>
            <EuiFlexItem style={{ height: '100%', overflow: 'auto' }}>
              <TodoPreviewList
                title={
                  <FormattedMessage
                    id="customPlugin.todosDashboard.pendingTodosTitle"
                    defaultMessage="Overdues TO-DOs"
                  />
                }
                todos={pendingTodos}
              />
            </EuiFlexItem>
            <EuiFlexItem style={{ height: '100%', overflow: 'auto' }}>
              <TodoPreviewList
                title={
                  <FormattedMessage
                    id="customPlugin.todosDashboard.todaysTodosTitle"
                    defaultMessage="Today's TO-DOs"
                  />
                }
                todos={todaysTodos}
              />
            </EuiFlexItem>
            <EuiFlexItem style={{ height: '100%', overflow: 'auto' }}>
              <TodoPreviewList
                title={
                  <FormattedMessage
                    id="customPlugin.todosDashboard.nextTodosTitle"
                    defaultMessage="Upcoming TO-DOs"
                  />
                }
                todos={nextTodos}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="xl" />
          <TodosCharts todos={allTodos} />
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
