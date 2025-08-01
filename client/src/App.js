import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { GRAPHQL_URI } from './URL';

const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache: new InMemoryCache()
});

// Wrap your app with ApolloProvider
<ApolloProvider client={client}>
  <App />
</ApolloProvider>