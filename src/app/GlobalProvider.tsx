import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  return (
    <React.StrictMode>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </React.StrictMode>
  );
};
