import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',  // Ensure this is the correct GraphQL API endpoint
  cache: new InMemoryCache(),
});
