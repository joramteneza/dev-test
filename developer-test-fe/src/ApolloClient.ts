import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: `${import.meta.env.VITE_BASE_URL}/graphql`,  // Ensure this is the correct GraphQL API endpoint
  cache: new InMemoryCache(),
});
