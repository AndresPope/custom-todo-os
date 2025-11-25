import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface CustomPluginPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPluginPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

export interface ITodo {
    id: string
    name: string
    state: "planned" | "completed" | "completed_with_errors"
    tag?: string
    owner: string
    priority: number
    plannedStartDate: Date | null
    createdAt: Date
    updatedAt: Date
}
