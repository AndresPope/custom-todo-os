import { useState } from 'react';
import { useAPI } from '../context';

export const useCompleteTodo = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  const api = useAPI();

  const completeTodo = async () => {
    try {
      setLoading(true);
      if (!api) return;
      await api.completeTodo(id);
    } catch (error) {
      console.error('Error completing todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, completeTodo };
};
