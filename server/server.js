const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Load environment variables
require('dotenv').config();

async function startServer() {
  const app = express();
  
  app.use(cors({
    origin: 'https://graphql-todo.vercel.app',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
  }));
  
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB using environment variable
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql_todo';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  
  // Use port from environment variable
  const port = process.env.PORT || 4000;
  app.listen({ port }, () => 
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  );
}

startServer();
