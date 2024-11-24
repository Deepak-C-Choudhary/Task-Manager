import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import AddTask from "./AddTask";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const filterTasks = () => {
    switch (filter) {
      case "COMPLETED":
        return tasks.filter((task) => task.completed);
      case "PENDING":
        return tasks
          .filter((task) => !task.completed)
          .sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
      default:
        return tasks;
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <AddTask onTaskAdded={handleTaskAdded} />
      <div className="flex justify-around mb-4">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded ${
            filter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("COMPLETED")}
          className={`px-4 py-2 rounded ${
            filter === "COMPLETED" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          className={`px-4 py-2 rounded ${
            filter === "PENDING" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>
      </div>
      <div className="space-y-4">
        {filterTasks().map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;































// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import TaskItem from "./TaskItem";
// import AddTask from "./AddTask";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filter, setFilter] = useState("ALL");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         process.env.REACT_APP_API_URL || "http://localhost:5000/api/tasks"
//       );
//       setTasks(response.data);
//     } catch (err) {
//       setError("Failed to load tasks. Please try again later.");
//       console.error("Error fetching tasks:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterTasks = useCallback(() => {
//     switch (filter) {
//       case "COMPLETED":
//         return tasks.filter((task) => task.completed);
//       case "PENDING":
//         return tasks
//           .filter((task) => !task.completed)
//           .sort((a, b) => {
//             const priorityOrder = { high: 1, medium: 2, low: 3 };
//             return priorityOrder[a.priority] - priorityOrder[b.priority];
//           });
//       default:
//         return tasks;
//     }
//   }, [tasks, filter]);

//   const handleTaskAdded = useCallback(
//     (newTask) => setTasks((prevTasks) => [newTask, ...prevTasks]),
//     []
//   );

//   const handleTaskUpdated = useCallback(
//     (updatedTask) =>
//       setTasks((prevTasks) =>
//         prevTasks.map((task) =>
//           task._id === updatedTask._id ? updatedTask : task
//         )
//       ),
//     []
//   );

//   const handleTaskDeleted = useCallback(
//     (taskId) =>
//       setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId)),
//     []
//   );

//   const getButtonClasses = (currentFilter) =>
//     `px-4 py-2 rounded ${
//       filter === currentFilter
//         ? "bg-blue-500 text-white"
//         : "bg-gray-200 hover:bg-gray-300"
//     }`;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <AddTask onTaskAdded={handleTaskAdded} />

//       {/* Filter Buttons */}
//       <div className="flex justify-around mb-4">
//         <button
//           onClick={() => setFilter("ALL")}
//           className={getButtonClasses("ALL")}
//         >
//           All
//         </button>
//         <button
//           onClick={() => setFilter("COMPLETED")}
//           className={getButtonClasses("COMPLETED")}
//         >
//           Completed
//         </button>
//         <button
//           onClick={() => setFilter("PENDING")}
//           className={getButtonClasses("PENDING")}
//         >
//           Pending
//         </button>
//       </div>

//       {/* Task List */}
//       <div className="space-y-4">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading tasks...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : filterTasks().length > 0 ? (
//           filterTasks().map((task) => (
//             <TaskItem
//               key={task._id}
//               task={task}
//               onTaskUpdated={handleTaskUpdated}
//               onTaskDeleted={handleTaskDeleted}
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No tasks found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TaskList;

