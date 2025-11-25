import React, { useState } from 'react';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { TodoForm } from './todo-form';

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const closeModal = () => setIsModalVisible(false);

  const showModal = () => setIsModalVisible(true);

  const handleSubmitForm = () => {
    if (!formRef.current) return;
    formRef.current.requestSubmit();
  };

  return (
    <div>
      <EuiButton fill color="primary" onClick={showModal}>
        <FormattedMessage
          id="customPlugin.addTodo.openModalButtonLabel"
          defaultMessage="Add TO-DO"
        />
      </EuiButton>
      {isModalVisible && (
        <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1>
                <FormattedMessage
                  id="customPlugin.addTodo.modalTitle"
                  defaultMessage="Add a new TO-DO"
                />
              </h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <TodoForm ref={formRef} />
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButtonEmpty size="s" onClick={closeModal}>
              <FormattedMessage
                id="customPlugin.addTodo.cancelButtonLabel"
                defaultMessage="Cancel"
              />
            </EuiButtonEmpty>

            <EuiButton onClick={handleSubmitForm} size="s" fill>
              <FormattedMessage id="customPlugin.addTodo.saveButtonLabel" defaultMessage="Save" />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      )}
    </div>
  );
};
