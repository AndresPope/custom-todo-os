import React, { useState } from 'react';
import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButton,
  EuiButtonEmpty,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSelect,
  EuiDatePicker,
} from '@elastic/eui';
import moment from 'moment';
import { ITodo } from '../../types';

type Props = {
  todo: ITodo;
  onClose: () => void;
  onSave: (id: string, updates: any) => void;
};

export const EditTodoModal: React.FC<Props> = ({ todo, onClose, onSave }) => {
  const [name, setName] = useState(todo.name);
  const [priority, setPriority] = useState(todo.priority);
  const [tag, setTag] = useState(todo.tag || '');
  const [plannedStartDate, setPlannedStartDate] = useState(
    todo.plannedStartDate ? moment(todo.plannedStartDate) : null
  );

  const handleSave = () => {
    onSave(todo.id, {
      name,
      priority,
      tag: tag || undefined,
      plannedStartDate: plannedStartDate?.toDate(),
    });
  };

  return (
    <EuiModal onClose={onClose}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>Edit TODO</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiForm>
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
            <EuiDatePicker
              selected={plannedStartDate}
              onChange={(date) => setPlannedStartDate(date)}
            />
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={onClose}>Cancel</EuiButtonEmpty>
        <EuiButton onClick={handleSave} fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};
