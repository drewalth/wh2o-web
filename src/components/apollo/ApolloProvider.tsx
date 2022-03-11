import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider as ApolloProviderCore, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { ReactNode } from 'react';
import { WebSocketLink } from './WebSocketLink';

const httpLink = new HttpLink({
  // @ts-ignore
  uri: import.meta.env.VITE_APOLLO_SERVER
});

const wsLink = new WebSocketLink({
  // @ts-ignore
  url: import.meta.env.VITE_APOLLO_SUBSCRIPTION || '',
  retryAttempts: 20,
  keepAlive: 10_000
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('wh2o-token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(splitLink)
});

type ApolloProviderProps = {
  children: ReactNode;
};

export const ApolloProvider = ({ children }: ApolloProviderProps) => (
  <ApolloProviderCore client={client}>{children}</ApolloProviderCore>
);
