import React, { ReactNode } from 'react';
import { ApolloProvider } from '../components/apollo/ApolloProvider';
import { UserProvider } from '../components/user/UserProvider';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ApolloProvider>
      <UserProvider>{children}</UserProvider>
    </ApolloProvider>
  );
};
