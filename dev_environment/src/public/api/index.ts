import { CoreStart } from '../../../../src/core/public';
import { ITodo } from '../types';

type CreateTodoInput = {
  name: string;
  tag?: string;
  priority: number;
  plannedStartDate: Date;
};

type GetTodosParams = {
  q?: string;
  filters?: Record<string, any>;
  from?: number;
  size?: number;
};

export class TodosAPIService {
  constructor(private http: CoreStart['http']) {}

  public getTodos(params?: GetTodosParams) {
    const queryParams: Record<string, string> = {};

    if (params?.q) {
      queryParams['q'] = params.q;
    }
    if (params?.filters) {
      queryParams['filters'] = JSON.stringify(params.filters);
    }
    if (params?.from !== undefined) {
      queryParams['from'] = params.from.toString();
    }
    if (params?.size !== undefined) {
      queryParams['size'] = params.size.toString();
    }
    return this.http.get<{ hits: ITodo[]; total: number }>('/api/custom_plugin/list_todos', {
      query: queryParams,
    });
  }

  public createTodo(body: CreateTodoInput) {
    return this.http.post<any>('/api/custom_plugin/create_todo', {
      body: JSON.stringify(body),
    });
  }

  public completeTodo(id: string) {
    return this.http.put<{ success: boolean }>(`/api/custom_plugin/complete_todo/${id}`);
  }

  public deleteTodo(id: string) {
    return this.http.delete<{ success: boolean }>(`/api/custom_plugin/delete_todo/${id}`);
  }

  public updateTodo(id: string, updates: Partial<CreateTodoInput>) {
    return this.http.put<{ success: boolean }>(`/api/custom_plugin/update_todo/${id}`, {
      body: JSON.stringify(updates),
    });
  }
}
