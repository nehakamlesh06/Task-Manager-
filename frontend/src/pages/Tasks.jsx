import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Could not load tasks. Please log in again.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post('/tasks', { title, description, completed: false });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError('Could not add task.');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });
      fetchTasks();
    } catch (err) {
      setError('Could not update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Could not delete task.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>My Tasks</h2>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="add-task-card">
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={{ marginBottom: '4px' }}
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              Add Task
            </button>
          </form>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one above to get started.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-card">
                <div>
                  <div className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </div>
                  <div className="task-description">{task.description}</div>
                </div>
                <div className="task-actions">
                  <button onClick={() => toggleComplete(task)} className="btn-complete">
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Tasks;