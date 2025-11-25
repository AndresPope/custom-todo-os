import React, { useMemo } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiStat, EuiPanel, EuiTitle, EuiSpacer } from '@elastic/eui';
import { Chart, Settings, Axis, BarSeries, Partition } from '@elastic/charts';
import { FormattedMessage } from '@osd/i18n/react';
import { ITodo } from '../../types';

interface TodosChartsProps {
  todos: ITodo[];
}

const priorityLabel: { [x: number]: string } = {
  1: 'Urgent',
  2: 'High',
  3: 'Medium',
  4: 'Low',
};

const stateLabel = {
  planned: 'Planned',
  completed: 'Completed',
  completed_with_errors: 'Completed with errors',
};

export const TodosCharts: React.FC<TodosChartsProps> = ({ todos }) => {
  const { statusData, priorityData, completionStats } = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    todos.forEach((todo) => {
      const label = stateLabel[todo.state];
      statusCounts[label] = (statusCounts[label] || 0) + 1;
    });

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    const priorityCounts: Record<string, number> = {};
    todos.forEach((todo) => {
      const label = priorityLabel[todo.priority];
      priorityCounts[label] = (priorityCounts[label] || 0) + 1;
    });

    const priorityData = ['Urgent', 'High', 'Medium', 'Low'].map((priority) => ({
      priority,
      count: priorityCounts[priority] || 0,
    }));

    const totalTasks = todos.length;
    const completedTasks = todos.filter(
      (todo) => todo.state === 'completed' || todo.state === 'completed_with_errors'
    ).length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      statusData,
      priorityData,
      completionStats: { totalTasks, completedTasks, completionPercentage },
    };
  }, [todos]);
  return (
    <>
      <EuiTitle size="l">
        <h3>
          <FormattedMessage id="customPlugin.todosCharts.title" defaultMessage="TO-DOs Overview" />
        </h3>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks by Status</h3>
            </EuiTitle>
            <Chart size={{ height: 200 }}>
              <Settings showLegend legendPosition="right" />
              <Partition
                id="status"
                data={statusData}
                valueAccessor={(d) => d.count}
                layers={[
                  {
                    groupByRollup: (d: typeof statusData[0]) => d.status,
                  },
                ]}
              />
            </Chart>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks by Priority</h3>
            </EuiTitle>
            <Chart size={{ height: 200 }}>
              <Settings showLegend={false} rotation={90} />
              <BarSeries
                id="priority"
                name="Priority"
                data={priorityData}
                xAccessor="priority"
                yAccessors={['count']}
              />
              <Axis id="bottom-axis" position="bottom" />
              <Axis id="left-axis" position="left" />
            </Chart>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem grow={false} style={{ width: 200 }}>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Completion Rate</h3>
            </EuiTitle>
            <EuiStat
              title={`${completionStats.completionPercentage}%`}
              description={`${completionStats.completedTasks} of ${completionStats.totalTasks} tasks completed`}
              titleColor="primary"
              textAlign="center"
            />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
