import React, { useState, useEffect } from 'react';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("https://playground.4geeks.com/todo/users/Itsman07", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        if (data && data.todos && Array.isArray(data.todos)) {
          setTasks(data.todos);
        } else {
          console.error("Error: La respuesta de la API no tiene la estructura esperada para las tareas.");
          setTasks([]);
        }
      })
      .catch((error) => console.error("Error al obtener las tareas:", error));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      const newTaskObject = {
        text: newTask, // Intentando con 'text' en lugar de 'label'
        done: false
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskObject),
        redirect: "follow"
      };

      fetch("https://playground.4geeks.com/todo/users/Itsman07", requestOptions)
        .then((response) => {
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Tarea agregada:", data);
          fetchTasks();
          setNewTask('');
        })
        .catch((error) => console.error("Error al agregar la tarea:", error));
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, is_done: !task.is_done } : task
    );
    setTasks(updatedTasks);
    // Aquí también deberías hacer un PUT a la API para actualizar el estado de la tarea
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    // Aquí también deberías hacer un DELETE a la API para eliminar la tarea
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.is_done;
    if (filter === 'completed') return task.is_done;
    return true;
  });

  const activeTasksCount = tasks.filter(task => !task.is_done).length;

  return (
    <div className="todo-app">
      <h1>Itsban's To Do List</h1>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Añadir nueva tarea..."
          className="task-input"
        />
        <button type="submit" className="add-button">Añadir</button>
      </form>

      <div className="filters">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completadas
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-message">
            {filter === 'all'
              ? 'No hay tareas. ¡Añade una!'
              : filter === 'active'
                ? '¡No hay tareas pendientes!'
                : 'No hay tareas completadas'}
          </p>
        ) : (
          <ul>
            {filteredTasks.map(task => (
              <li key={task.id} className={`task-item ${task.is_done ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.is_done}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
                <span className="task-text">{task.label}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="task-stats">
          <p>{activeTasksCount} {activeTasksCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}</p>
        </div>
      )}
    </div>
  );
}

export default Home;