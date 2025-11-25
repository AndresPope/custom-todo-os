import React from 'react';
import { CoreStart, IToasts } from '../../../../src/core/public';
import { TodosAPIService } from '../api';

export const APIContext = React.createContext<TodosAPIService | null>(null);
export const NotificationContext = React.createContext<IToasts | null>(null);

export const APIContextProvider: React.FC<{
  http: CoreStart['http'];
  notifications: CoreStart['notifications'];
}> = ({ http, notifications, children }) => {
  const todosAPIService = new TodosAPIService(http);
  const toast = notifications.toasts;

  return (
    <NotificationContext.Provider value={toast}>
      <APIContext.Provider value={todosAPIService}>{children}</APIContext.Provider>
    </NotificationContext.Provider>
  );
};

export const useAPI = () => {
  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within a APIContextProvider');
  }
  return context;
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationContextProvider');
  }
  return context;
};
