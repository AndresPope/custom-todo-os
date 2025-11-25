import { TODO_INDEX } from '../../common';
import { OpenSearchClient, Logger } from '../../../../src/core/server';
import index from '../shared/todos.index';

export interface ITodosDocument {
  id: string;
  name: string;
  state: 'planned' | 'completed' | 'completed_with_errors';
  tag?: string;
  owner: string;
  priority: number;
  plannedStartDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TodosDBService {
  private client: OpenSearchClient;
  private logger: Logger;
  private indexName: string;

  constructor(client: OpenSearchClient, logger: Logger) {
    this.client = client;
    this.logger = logger;
    this.indexName = TODO_INDEX;
  }

  async initializeIndex(): Promise<void> {
    try {
      this.logger.info(`Inicializando índice: ${this.indexName}`);

      const indexExists = await this.client.indices.exists({
        index: this.indexName,
      });

      if (!indexExists.body) {
        this.logger.info(`Índice ${this.indexName} no existe. Creando...`);
        await this.client.indices.create({
          index: this.indexName,
          body: index,
        });
      }

      this.logger.info(`Índice ${this.indexName} creado exitosamente`);
    } catch (error: any) {
      this.logger.error(`Error en initializeIndex:`);
      this.logger.error(`  Mensaje: ${error.message}`);
      this.logger.error(`  StatusCode: ${error.statusCode}`);
      this.logger.error(`  Body: ${JSON.stringify(error.meta?.body || {})}`);
      throw error;
    }
  }

  async createTodo(document: ITodosDocument): Promise<void> {
    try {
      console.log(document);
      const { id, ...rest } = document;
      const response = await this.client.create({
        index: this.indexName,
        id,
        body: rest,
        refresh: true,
      });

      this.logger.info(`Documento creado con ID: ${response.body._id}`);
    } catch (error: any) {
      this.logger.error(`Error al crear documento: ${error.message}`);
      throw error;
    }
  }

  async listTodos(params: {
    query?: string;
    filters?: Record<string, any>;
    from?: number;
    size?: number;
    sort?: any[];
  }): Promise<any> {
    const {
      query = '',
      filters = {},
      from = 0,
      size = 10,
      sort = [{ createdAt: { order: 'desc' } }],
    } = params;

    try {
      const must = [];
      const filter = [];

      if (query) {
        must.push({
          multi_match: {
            query,
            fields: ['name^3'],
            type: 'best_fields',
            fuzziness: 'AUTO',
          },
        });
      }

      Object.entries(filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            filter.push({ terms: { [field]: value } });
          } else {
            filter.push({ term: { [field]: value } });
          }
        }
      });

      const searchQuery = {
        ...(must.length || filter.length
          ? {
              bool: {
                ...(must.length && { must }),
                ...(filter.length && { filter }),
              },
            }
          : { match_all: {} }),
      };

      const response = await this.client.search({
        index: this.indexName,
        body: {
          query: searchQuery,
          from,
          size,
          sort,
          track_total_hits: true,
        },
      });

      return {
        total: response.body.hits.total.value,
        hits: response.body.hits.hits.map((hit: any) => ({
          id: hit._id,
          ...hit._source,
          _score: hit._score,
        })),
        aggregations: response.body.aggregations,
      };
    } catch (error) {
      this.logger.error(`Error en búsqueda: ${error.message}`);
      throw error;
    }
  }

  async completeTodo(id: string): Promise<void> {
    try {
      await this.client.update({
        index: this.indexName,
        id,
        body: {
          doc: {
            state: 'completed',
            updatedAt: new Date(),
          },
        },
        refresh: true,
      });

      this.logger.info(`TODO ${id} marcado como completado`);
    } catch (error: any) {
      this.logger.error(`Error al completar TODO: ${error.message}`);
      throw error;
    }
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id,
        refresh: true,
      });

      this.logger.info(`TODO ${id} eliminado`);
    } catch (error: any) {
      this.logger.error(`Error al eliminar TODO: ${error.message}`);
      throw error;
    }
  }

  async updateTodo(id: string, updates: Partial<ITodosDocument>): Promise<void> {
    try {
      // Remove id from updates if present
      const { id: _, ...updateFields } = updates as any;

      await this.client.update({
        index: this.indexName,
        id,
        body: {
          doc: updateFields,
        },
        refresh: true,
      });

      this.logger.info(`TODO ${id} actualizado`);
    } catch (error: any) {
      this.logger.error(`Error al actualizar TODO: ${error.message}`);
      throw error;
    }
  }
}
