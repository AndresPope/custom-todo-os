import { schema } from '@osd/config-schema';
import { IRouter, Logger } from '../../../../src/core/server';
import { TodosDBService, ITodosDocument } from '../services/todos.service';
import uuid from 'uuid';

export function defineRoutes(router: IRouter, logger: Logger) {
  router.post(
    {
      path: '/api/custom_plugin/create_todo',
      validate: {
        body: schema.object({
          name: schema.string(),
          tag: schema.maybe(schema.string()),
          priority: schema.number(),
          plannedStartDate: schema.maybe(schema.string()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.client.asInternalUser;
        const dbService = new TodosDBService(client, logger);
        const todoDocument: ITodosDocument = {
          id: uuid.v4(),
          name: request.body.name,
          state: 'planned',
          tag: request.body.tag,
          owner: 'default_owner',
          priority: request.body.priority,
          plannedStartDate: request.body.plannedStartDate
            ? new Date(request.body.plannedStartDate)
            : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await dbService.createTodo(todoDocument);

        return response.ok({
          body: todoDocument,
        });
      } catch (error: any) {
        logger.error(`Error creating todo: ${error.message}`);
        return response.internalError({
          body: {
            message: 'Error creating todo',
          },
        });
      }
    }
  );
  router.get(
    {
      path: '/api/custom_plugin/list_todos',
      validate: {
        query: schema.object({
          q: schema.maybe(schema.string()),
          filters: schema.maybe(schema.string()),
          from: schema.maybe(schema.number()),
          size: schema.maybe(schema.number()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.client.asInternalUser;
        const dbService = new TodosDBService(client, logger);

        const responseItems = await dbService.listTodos({
          query: request.query.q,
          filters: request.query.filters ? JSON.parse(request.query.filters) : undefined,
          from: request.query.from,
          size: request.query.size,
        });

        return response.ok({
          body: responseItems,
        });
      } catch (error: any) {
        logger.error(`Error listing todos: ${error.message}`);
        return response.internalError({
          body: {
            message: 'Error listing todos',
          },
        });
      }
    }
  );

  router.put(
    {
      path: '/api/custom_plugin/complete_todo/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.client.asInternalUser;
        const dbService = new TodosDBService(client, logger);

        console.log('Completing todo with id:', request.params.id);

        await dbService.completeTodo(request.params.id);

        return response.ok({
          body: { success: true },
        });
      } catch (error: any) {
        logger.error(`Error completing todo: ${error.message}`);
        return response.internalError({
          body: {
            message: 'Error completing todo',
          },
        });
      }
    }
  );

  router.delete(
    {
      path: '/api/custom_plugin/delete_todo/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.client.asInternalUser;
        const dbService = new TodosDBService(client, logger);

        await dbService.deleteTodo(request.params.id);

        return response.ok({
          body: { success: true },
        });
      } catch (error: any) {
        logger.error(`Error deleting todo: ${error.message}`);
        return response.internalError({
          body: {
            message: 'Error deleting todo',
          },
        });
      }
    }
  );

  router.put(
    {
      path: '/api/custom_plugin/update_todo/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
        body: schema.object({
          name: schema.maybe(schema.string()),
          state: schema.maybe(schema.string()),
          tag: schema.maybe(schema.string()),
          priority: schema.maybe(schema.number()),
          plannedStartDate: schema.maybe(schema.string()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.client.asInternalUser;
        const dbService = new TodosDBService(client, logger);

        const updates: Partial<ITodosDocument> = {
          ...request.body,
          plannedStartDate: request.body.plannedStartDate
            ? new Date(request.body.plannedStartDate)
            : undefined,
          updatedAt: new Date(),
        };

        await dbService.updateTodo(request.params.id, updates);

        return response.ok({
          body: { success: true },
        });
      } catch (error: any) {
        logger.error(`Error updating todo: ${error.message}`);
        return response.internalError({
          body: {
            message: 'Error updating todo',
          },
        });
      }
    }
  );
}
