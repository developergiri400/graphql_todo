const Todo = require('./models/Todo');

const resolvers = {
  Query: {
    todos: async () => {
      const todos = await Todo.find({ status: 'todo' });
      return todos.map(todo => ({
        id: todo._id.toString(),
        text: todo.text,
        status: todo.status
      }));
    },
    completedTodos: async () => {
      const todos = await Todo.find({ status: 'completed' });
      return todos.map(todo => ({
        id: todo._id.toString(),
        text: todo.text,
        status: todo.status
      }));
    },
    deletedTodos: async () => {
      const todos = await Todo.find({ status: 'deleted' });
      return todos.map(todo => ({
        id: todo._id.toString(),
        text: todo.text,
        status: todo.status
      }));
    }
  },
  Mutation: {
    addTodo: async (_, { text }) => {
      const newTodo = new Todo({
        text,
        status: 'todo'
      });
      const savedTodo = await newTodo.save();
      return {
        id: savedTodo._id.toString(),
        text: savedTodo.text,
        status: savedTodo.status
      };
    },
    updateTodo: async (_, { id, text, status }) => {
      const updateFields = {};
      if (text !== undefined) updateFields.text = text;
      if (status !== undefined) updateFields.status = status;
      
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
      
      if (!updatedTodo) {
        throw new Error('Todo not found');
      }
      
      return {
        id: updatedTodo._id.toString(),
        text: updatedTodo.text,
        status: updatedTodo.status
      };
    },
    deleteTodo: async (_, { id }) => {
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { status: 'deleted' },
        { new: true }
      );
      
      return !!updatedTodo;
    }
  }
};

module.exports = resolvers;