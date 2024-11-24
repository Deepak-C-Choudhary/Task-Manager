import React, { useState } from "react";

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTask),
        }
      );

      if (!response.ok) throw new Error("Update failed");
      const data = await response.json();
      onTaskUpdated(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Delete failed");
      onTaskDeleted(task._id);
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const toggleComplete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...task,
            completed: !task.completed,
          }),
        }
      );

      if (!response.ok) throw new Error("Toggle failed");
      const data = await response.json();
      onTaskUpdated(data);
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  const getPriorityStyles = (priority) => {
    const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";
    switch (priority) {
      case "low":
        return `${baseStyles} bg-green-100 text-green-800`;
      case "medium":
        return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case "high":
        return `${baseStyles} bg-red-100 text-red-800`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusStyles = (completed) => {
    return completed
      ? "text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm"
      : "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-sm";
  };

  const getSafePriority = () => {
    const priority = task.priority || "low"; // Default to "low" if undefined
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 transition-all duration-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={editedTask.priority || "low"}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                value={
                  editedTask.dueDate ? editedTask.dueDate.split(".")[0] : ""
                }
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-sm border p-6 mb-4 transition-all duration-200 ${
        task.completed
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleComplete}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`text-lg font-medium ${
                  task.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              <p className="mt-1 text-gray-600 whitespace-pre-line">
                {task.description}
              </p>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className={getPriorityStyles(task.priority || "low")}>
              {getSafePriority()}
            </span>

            {task.category && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {task.category}
              </span>
            )}

            <span className={getStatusStyles(task.completed)}>
              {task.completed ? "Completed" : "Pending"}
            </span>

            {task.dueDate && (
              <span className="text-sm text-gray-500">
                Due: {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
























// import React, { useState } from "react";

// // Utility function for API calls
// const apiCall = async (url, method, body = null) => {
//   const options = {
//     method,
//     headers: { "Content-Type": "application/json" },
//   };
//   if (body) options.body = JSON.stringify(body);

//   const response = await fetch(url, options);
//   if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
//   return response.json();
// };

// const formatDate = (date) => {
//   return new Date(date).toLocaleString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedTask, setEditedTask] = useState(task);

//   const apiURL =
//     process.env.REACT_APP_API_URL || "http://localhost:5000/api/tasks";

//   const handleUpdate = async () => {
//     try {
//       const updatedTask = await apiCall(
//         `${apiURL}/${task._id}`,
//         "PUT",
//         editedTask
//       );
//       onTaskUpdated(updatedTask);
//       setIsEditing(false);
//     } catch (error) {
//       alert("Failed to update task. Please try again.");
//       console.error("Error updating task:", error.message);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await apiCall(`${apiURL}/${task._id}`, "DELETE");
//       onTaskDeleted(task._id);
//     } catch (error) {
//       alert("Failed to delete task. Please try again.");
//       console.error("Error deleting task:", error.message);
//     }
//   };

//   const toggleComplete = async () => {
//     try {
//       const updatedTask = await apiCall(`${apiURL}/${task._id}`, "PUT", {
//         ...task,
//         completed: !task.completed,
//       });
//       onTaskUpdated(updatedTask);
//     } catch (error) {
//       alert("Failed to toggle task status. Please try again.");
//       console.error("Error toggling task status:", error.message);
//     }
//   };

//   const getPriorityStyles = (priority) => {
//     const baseStyles = "px-3 py-1 rounded-full text-sm font-medium";
//     switch (priority) {
//       case "low":
//         return `${baseStyles} bg-green-100 text-green-800`;
//       case "medium":
//         return `${baseStyles} bg-yellow-100 text-yellow-800`;
//       case "high":
//         return `${baseStyles} bg-red-100 text-red-800`;
//       default:
//         return `${baseStyles} bg-gray-100 text-gray-800`;
//     }
//   };

//   const getStatusStyles = (completed) => {
//     return completed
//       ? "text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm"
//       : "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-sm";
//   };

//   const getSafePriority = () => {
//     const priority = task.priority || "low"; // Default to "low" if undefined
//     return priority.charAt(0).toUpperCase() + priority.slice(1);
//   };

//   if (isEditing) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 transition-all duration-200">
//         <div className="space-y-4">
//           <div>
//             <label
//               htmlFor="edit-title"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Title
//             </label>
//             <input
//               id="edit-title"
//               type="text"
//               value={editedTask.title}
//               onChange={(e) =>
//                 setEditedTask((prev) => ({ ...prev, title: e.target.value }))
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="edit-description"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Description
//             </label>
//             <textarea
//               id="edit-description"
//               value={editedTask.description}
//               onChange={(e) =>
//                 setEditedTask((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label
//                 htmlFor="edit-priority"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Priority
//               </label>
//               <select
//                 id="edit-priority"
//                 value={editedTask.priority || "low"}
//                 onChange={(e) =>
//                   setEditedTask((prev) => ({
//                     ...prev,
//                     priority: e.target.value,
//                   }))
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>

//             <div>
//               <label
//                 htmlFor="edit-due-date"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Due Date
//               </label>
//               <input
//                 id="edit-due-date"
//                 type="datetime-local"
//                 value={
//                   editedTask.dueDate ? editedTask.dueDate.split(".")[0] : ""
//                 }
//                 onChange={(e) =>
//                   setEditedTask((prev) => ({
//                     ...prev,
//                     dueDate: e.target.value,
//                   }))
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setIsEditing(false)}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleUpdate}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`rounded-lg shadow-sm border p-6 mb-4 transition-all duration-200 ${
//         task.completed
//           ? "bg-green-50 border-green-200"
//           : "bg-white border-gray-200"
//       }`}
//     >
//       <div className="flex items-start gap-4">
//         <div>
//           <input
//             type="checkbox"
//             checked={task.completed}
//             onChange={toggleComplete}
//             aria-label="Toggle task completion"
//             className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//           />
//         </div>

//         <div className="flex-1">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3
//                 className={`text-lg font-medium ${
//                   task.completed
//                     ? "text-gray-500 line-through"
//                     : "text-gray-900"
//                 }`}
//               >
//                 {task.title}
//               </h3>
//               <p className="mt-1 text-gray-600 whitespace-pre-line">
//                 {task.description}
//               </p>
//             </div>
//             <div className="flex gap-2 ml-4">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>

//           <div className="mt-4 flex flex-wrap items-center gap-3">
//             <span className={getPriorityStyles(task.priority || "low")}>
//               {getSafePriority()}
//             </span>
//             {task.category && (
//               <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                 {task.category}
//               </span>
//             )}
//             <span className={getStatusStyles(task.completed)}>
//               {task.completed ? "Completed" : "Pending"}
//             </span>
//             {task.dueDate && (
//               <span className="text-sm text-gray-500">
//                 Due: {formatDate(task.dueDate)}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskItem;

