import React from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID } from '../../common';
import { TodosDashboard } from './dashboard/todos-dashboard';
import { APIContextProvider } from '../context';
import { TodosTable } from './todos-table';

interface CustomPluginAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const CustomPluginApp = ({
  basename,
  notifications,
  http,
  navigation,
}: CustomPluginAppDeps) => {
  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <APIContextProvider http={http} notifications={notifications}>
          <>
            <navigation.ui.TopNavMenu appName={PLUGIN_ID} />
            <Switch>
              <Route exact path={'/'} component={TodosDashboard} />
              <Route path={'/backlog'} component={TodosTable} />
            </Switch>
          </>
        </APIContextProvider>
      </I18nProvider>
    </Router>
  );
};
