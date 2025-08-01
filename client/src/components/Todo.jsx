import React, { useState } from 'react';
import './Todo.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TrashFill, PencilSquare, ClockHistory } from "react-bootstrap-icons";
import { gql, useQuery, useMutation } from '@apollo/client';
import Typewriter from 'typewriter-effect';
import { Tooltip } from 'react-tooltip';

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      status
    }
  }
`;

const GET_COMPLETED_TODOS = gql`
  query GetCompletedTodos {
    completedTodos {
      id
      text
      status
    }
  }
`;

const GET_DELETED_TODOS = gql`
  query GetDeletedTodos {
    deletedTodos {
      id
      text
      status
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      status
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $text: String, $status: String) {
    updateTodo(id: $id, text: $text, status: $status) {
      id
      text
      status
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export default function Todo() {
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Keep only one set of query hooks (remove duplicates below)
  const { loading, error, data, refetch } = useQuery(GET_TODOS, {
    onCompleted: (data) => {
      console.log('Active Todos:', data?.todos);
    },
    onError: (error) => {
      console.error('Error fetching active todos:', error);
    }
  });
  
  const { data: completedData, refetch: refetchCompleted } = useQuery(GET_COMPLETED_TODOS, {
    onCompleted: (data) => {
      console.log('Completed Todos:', data?.completedTodos);
    },
    onError: (error) => {
      console.error('Error fetching completed todos:', error);
    }
  });
  
  const { data: deletedData, refetch: refetchDeleted } = useQuery(GET_DELETED_TODOS, {
    onCompleted: (data) => {
      console.log('Deleted Todos:', data?.deletedTodos);
    },
    onError: (error) => {
      console.error('Error fetching deleted todos:', error);
    }
  });
  
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      await addTodo({ 
        variables: { 
          text: input 
        },
        refetchQueries: [
          { query: GET_TODOS },
          { query: GET_COMPLETED_TODOS },
          { query: GET_DELETED_TODOS }
        ]
      });
      setInput('');
      toast(<h6 style={{ margin:'5px',fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>Todo Added successfully</h6>);
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo");
    }
  };

  // Update the toggleComplete function to also refetch history data
  const toggleComplete = async (id, currentStatus) => {
    await updateTodo({
      variables: {
        id,
        status: currentStatus === 'todo' ? 'completed' : 'todo'
      }
    });
    refetch();
    refetchCompleted();
    toast(<h6 style={{ margin:'5px',fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>Status Updated successfully</h6>);
  };
  
 
  

  const handleDelete = async (id) => {
    await deleteTodo({ variables: { id } });
    refetch();
    refetchDeleted();
    toast(<h6 style={{ margin:'5px',fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>Todo Deleted successfully</h6>);
  };



  const handleUpdate = async (id) => {
    await updateTodo({ 
      variables: { 
        id, 
        text: editedText 
      } 
    });
    setEditingId(null);
    refetch();
    toast(<h6 style={{ margin:'5px',fontWeight: 'bold', color: 'rgb(29, 9, 78)' }}>Todo Updated successfully</h6>);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='main-container'>
      <div>
        <div className="todo-container">
          <div className="todo-card">
            <h2 className="todo-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ display: 'inline-block' }}>
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString('GraphQL')
                      .callFunction(() => {
                        // Hide cursor after typing is complete
                        const cursor = document.querySelector('.Typewriter__cursor');
                        if (cursor) cursor.style.display = 'none';
                      })
                      .start();
                  }}
                  options={{
                    delay: 100,
                    cursor: '|',
                  }}
                />
              </span>
              <span style={{ display: 'inline-block' }}>_To-do list</span>
            </h2>

            <div className="todo-input-container">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder="Enter your text here"
                className="todo-input"
              />
              <button onClick={handleAdd} className="todo-add-button">
                Add
              </button>
            </div>

            {/* Main todos section - GraphQL already returns only 'todo' items */}
            <div className="todos-scrollable-container">
              {data?.todos?.map((todo) => (
              <div key={todo.id} className="todo-item">
                <div className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.status === 'completed'}
                    onChange={() => toggleComplete(todo.id, todo.status)}
                    style={{ marginRight: '10px' }}
                  />
                </div>
                <div className="todo-content">
                  {editingId === todo.id ? (
                    <input
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUpdate(todo.id);
                        }
                        if (e.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                      className="todo-input"
                      autoFocus
                    />
                  ) : (
                    <span className="todo-text">{todo.text}</span>
                  )}
                </div>
                <div className="todo-actions">
                  {editingId === todo.id ? (
                    <button onClick={() => handleUpdate(todo.id)} className="todo-action-button">✅</button>
                  ) : (
                    <PencilSquare
                      className="edit"
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditedText(todo.text);
                      }}
                    />
                  )}
                  <TrashFill
                    className="trash"
                    onClick={() => handleDelete(todo.id)}
                  />
                </div>
              </div>
            ))}
            </div>
            {/* History section */}
            <div className="history">
              <h4 onClick={() => setShowHistory(!showHistory)}>
                <ClockHistory className="history-icon" /> History
              </h4>

              {showHistory && (
                <div className="history-child">
                  <div className="completed-container">
                    <h2 className="todo-title">Completed</h2>
                    {completedData?.completedTodos?.map(todo => (
                      <div 
                        key={todo.id} 
                        className="todo-item"
                        data-tooltip-id="completed-tooltip"
                        data-tooltip-content="❌ REST: fetch('/api/todos').then(data => data.filter(t => t.status === 'completed'))&#10;&#10;✅ GraphQL: query { completedTodos { id text status } }"
                      >
                        <div className="todo-content">
                          <span className="todo-text" style={{ textDecoration: 'line-through' }}>
                            {todo.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="deleted-container">
                    <h2 className="todo-title">Deleted</h2>
                    {deletedData?.deletedTodos?.map(todo => (
                      <div 
                        key={todo.id} 
                        className="todo-item" 
                        style={{ opacity: 0.6 }}
                        data-tooltip-id="deleted-tooltip"
                        data-tooltip-content="❌ REST: fetch('/api/todos').then(data => data.filter(t => t.status === 'deleted'))&#10;&#10;✅ GraphQL: query { deletedTodos { id text status } }"
                      >
                        <div className="todo-content">
                          <span className="todo-text">{todo.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <ToastContainer />
        </div>

        {/* GraphQL vs REST Tooltips */}
        <Tooltip 
          id="completed-tooltip" 
          place="top"
          style={{
            backgroundColor: '#1a202c',
            color: '#e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '12px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            maxWidth: '400px',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            border: '2px solid cadetblue',
            whiteSpace: 'pre-line',
            lineHeight: '1.4'
          }}
        />
        
        <Tooltip 
          id="deleted-tooltip" 
          place="top"
          style={{
            backgroundColor: '#1a202c',
            color: '#e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '12px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            maxWidth: '400px',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            border: '2px solid crimson',
            whiteSpace: 'pre-line',
            lineHeight: '1.4'
          }}
        />

        {/* Footer Credit */}
        <div className="footer-credit">
        Developed by GIRI☕
        </div>

      </div>
    </div>
  );
}
