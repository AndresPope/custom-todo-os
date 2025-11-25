import React, { forwardRef, useState } from 'react';
import { EuiDatePicker, EuiFieldText, EuiFormRow, EuiSelect } from '@elastic/eui';
import moment from 'moment';

import { useAPI, useNotification } from '../../context';

const options = [
  { value: 1, text: 'Urgent' },
  { value: 2, text: 'High' },
  { value: 3, text: 'Medium' },
  { value: 4, text: 'Low' },
];

export const TodoForm = forwardRef<HTMLFormElement>((props, ref) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState(options[3].value);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [plannedStartDate, setPlannedStartDate] = useState<moment.Moment | null>(moment());

  const toasts = useNotification();
  const api = useAPI();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!api) return;
    try {
      if (!plannedStartDate) return;
      const response = await api.createTodo({
        name,
        priority,
        tag,
        plannedStartDate: plannedStartDate.toDate(),
      });
      toasts.addSuccess(`TO-DO ${response.name} created successfully`);
      setName('');
      setPriority(options[3].value);
      setTag(undefined);
      setPlannedStartDate(moment());
    } catch (e) {
      toasts.addDanger('Failed to create TO-DO');
      console.error('Error creating todo:', e);
    }
  };
  return (
    <form ref={ref} onSubmit={onSubmit}>
      <EuiFormRow label="Task name">
        <EuiFieldText value={name} onChange={(e) => setName(e.target.value)} />
      </EuiFormRow>

      <EuiFormRow label="Priority">
        <EuiSelect
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          options={[
            { value: 1, text: 'Urgent' },
            { value: 2, text: 'High' },
            { value: 3, text: 'Medium' },
            { value: 4, text: 'Low' },
          ]}
        />
      </EuiFormRow>

      <EuiFormRow label="Tag (optional)">
        <EuiFieldText value={tag} onChange={(e) => setTag(e.target.value)} />
      </EuiFormRow>

      <EuiFormRow label="Planned start date">
        <EuiDatePicker selected={plannedStartDate} onChange={(date) => setPlannedStartDate(date)} />
      </EuiFormRow>
    </form>
  );
});
