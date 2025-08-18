import React, { createContext, useContext } from 'react';
import { Alert } from '../types/Alert';

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
}

const defaultAlertContext: AlertContextType = {
  alerts: [],
  addAlert: () => undefined,
  clearAlerts: () => undefined,
};

const AlertContext = createContext<AlertContextType>(defaultAlertContext);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  return context;
};

export { AlertContext };
