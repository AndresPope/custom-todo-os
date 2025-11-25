import { useEffect, useState } from 'react';
import { useAPI } from '../context';
import { ITodo } from '../types';

export const useListBacklog = () => {
  const api = useAPI();
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      if (!api) return;
      setLoading(true);
      const res = await api.getTodos({ size: 100 });

      const todosData = res.hits.map((hit) => ({
        ...hit,
        plannedStartDate: hit.plannedStartDate ? new Date(hit.plannedStartDate) : null,
        createdAt: new Date(hit.createdAt),
        updatedAt: new Date(hit.updatedAt),
      }));

      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [api]);

  return { todos, loading, refetch: fetchTodos };
};
