import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Todo from './components/Todo';
import { GRAPHQL_URI } from './URL';

const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/todos" element={<Todo />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
