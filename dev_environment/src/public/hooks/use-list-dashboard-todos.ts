import { useState, useEffect } from 'react';
import { ITodo } from '../types';
import { useAPI } from '../context';

const splitTodosByDate = (todos: ITodo[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pending = todos.filter((todo) => todo.plannedStartDate && todo.plannedStartDate < today);
  const todays = todos.filter(
    (todo) =>
      todo.plannedStartDate && todo.plannedStartDate >= today && todo.plannedStartDate < tomorrow
  );
  const next = todos.filter((todo) => todo.plannedStartDate && todo.plannedStartDate >= tomorrow);
  return { pending, todays, next };
};

export const useListDashboardTodos = () => {
  const api = useAPI();

  const [allTodos, setAllTodos] = useState<ITodo[]>([]);
  const [pendingTodos, setPendingTodos] = useState<ITodo[]>([]);
  const [todaysTodos, setTodaysTodos] = useState<ITodo[]>([]);
  const [nextTodos, setNextTodos] = useState<ITodo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      if (!api) return;
      const res = await api.getTodos({ size: 50 });

      const todos = res.hits.map((hit) => ({
        ...hit,
        plannedStartDate: hit.plannedStartDate ? new Date(hit.plannedStartDate) : null,
        createdAt: new Date(hit.createdAt),
        updatedAt: new Date(hit.updatedAt),
      }));

      setAllTodos(todos);
      const { pending, todays, next } = splitTodosByDate(todos);
      setPendingTodos(pending.sort((a, b) => a.priority - b.priority));
      setTodaysTodos(todays.sort((a, b) => a.priority - b.priority));
      setNextTodos(next.sort((a, b) => a.priority - b.priority));
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [api]);

  return { loading, allTodos, pendingTodos, todaysTodos, nextTodos, refetch: fetchTodos };
};
