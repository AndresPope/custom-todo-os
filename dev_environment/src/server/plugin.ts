import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { CustomPluginPluginSetup, CustomPluginPluginStart } from './types';
import { defineRoutes } from './routes';
import { startupTodosIndex, TodosDBService } from './services/todos.service';

export class CustomPluginPlugin
  implements Plugin<CustomPluginPluginSetup, CustomPluginPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('custom_plugin: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router, this.logger);

    core.getStartServices().then(async ([coreStart]) => {
      try {
        const client = coreStart.opensearch.client.asInternalUser;

        const dbService = new TodosDBService(client, this.logger);

        await dbService.initializeIndex();
      } catch (error) {
        this.logger.error(`Error during Todos index initialization: ${error}`);
      }
    });

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('custom_plugin: Started');
    return {};
  }

  public stop() {}
}
