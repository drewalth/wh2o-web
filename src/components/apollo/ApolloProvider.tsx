import React, { ReactNode } from 'react'
import { ApolloClient, ApolloProvider as ApolloProviderCore, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
// import {WebSocketLink} from './WebSocketLink';
import fetch from 'isomorphic-fetch'

const httpLink = new HttpLink({
  // @ts-ignore
  uri: process.env.GATSBY_APOLLO_SERVER,
  fetch
})
// const isBrowser = typeof window !== "undefined"
// let wsLink
// if (isBrowser) {
//     wsLink = new WebSocketLink({
//         // @ts-ignore
//         url: process.env.APOLLO_SERVER_SUB,
//         retryAttempts: 20,
//         keepAlive: 10_000
//     });
//
// }

// const splitLink = split(
//     ({query}) => {
//         const definition = getMainDefinition(query);
//         return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
//     },
//     wsLink,
//     httpLink
// );

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('wh2o-token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

export const resetCache = () => client.cache.reset()

type ApolloProviderProps = {
  children: ReactNode
}

export const ApolloProvider = ({ children }: ApolloProviderProps) => (
  <ApolloProviderCore client={client}>{children}</ApolloProviderCore>
)
