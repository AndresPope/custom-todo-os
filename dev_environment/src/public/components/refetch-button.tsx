import React from 'react';
import { EuiButton } from '@elastic/eui';
import { useNotification } from '../context';

type Props = {
  refetch: () => Promise<void>;
};

export const RefetchButton = ({ refetch }: Props) => {
  const toasts = useNotification();
  const handleRefetch = async () => {
    try {
      await refetch();
      toasts.addSuccess('Data refetched successfully');
    } catch (error) {
      toasts.addDanger('Error refetching data');
      console.error('Error refetching data:', error);
    }
  };
  return (
    <EuiButton onClick={handleRefetch} iconType="refresh">
      Refetch
    </EuiButton>
  );
};
