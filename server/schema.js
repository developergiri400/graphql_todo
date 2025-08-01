const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Todo {
    id: ID!
    text: String!
    status: String!
  }

  type Query {
    todos: [Todo]
    completedTodos: [Todo]
    deletedTodos: [Todo]
  }

  type Mutation {
    addTodo(text: String!): Todo
    updateTodo(id: ID!, text: String, status: String): Todo
    deleteTodo(id: ID!): Boolean
  }
`;

module.exports = typeDefs;