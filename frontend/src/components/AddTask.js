import React, { useState } from "react";

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleDueDateChange = (e) => {
    const newDate = e.target.value;
    if (new Date(newDate) > new Date()) {
      setDueDate(newDate);
    } else {
      alert("Please select a future date and time.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate: dueDate || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      onTaskAdded(data);
      setTitle("");
      setDescription("");
      setPriority("");
      setDueDate("");
    } catch (error) {
      console.error("Error creating task:", error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 h-24"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={handleDueDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;




















// import React, { useState } from "react";

// // Helper function for API calls
// const postData = async (url, payload) => {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.json();
// };

// const validateDueDate = (date) => {
//   return new Date(date) > new Date();
// };

// const AddTask = ({ onTaskAdded }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     priority: "",
//     dueDate: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDueDateChange = (e) => {
//     const newDate = e.target.value;
//     if (validateDueDate(newDate)) {
//       setFormData((prev) => ({ ...prev, dueDate: newDate }));
//     } else {
//       alert("Please select a future date and time.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { title, description, priority, dueDate } = formData;

//       const taskData = {
//         title,
//         description,
//         priority,
//         dueDate: dueDate || undefined,
//       };

//       const apiURL =
//         process.env.REACT_APP_API_URL || "http://localhost:5000/api/tasks";
//       const data = await postData(apiURL, taskData);

//       onTaskAdded(data);

//       // Reset form state
//       setFormData({
//         title: "",
//         description: "",
//         priority: "",
//         dueDate: "",
//       });
//     } catch (error) {
//       alert("An error occurred while adding the task. Please try again.");
//       console.error("Error creating task:", error.message);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded-lg p-6"
//         aria-labelledby="add-task-form"
//       >
//         <h2 id="add-task-form" className="text-lg font-semibold mb-4">
//           Add New Task
//         </h2>

//         <div className="mb-4">
//           <label
//             htmlFor="title"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Task Title
//           </label>
//           <input
//             id="title"
//             name="title"
//             type="text"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="What needs to be done?"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="description"
//             className="block text-gray-700 text-sm font-medium mb-2"
//           >
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Add details about this task"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 h-24"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label
//               htmlFor="priority"
//               className="block text-gray-700 text-sm font-medium mb-2"
//             >
//               Priority
//             </label>
//             <select
//               id="priority"
//               name="priority"
//               value={formData.priority}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
//               required
//             >
//               <option value="" disabled>
//                 Select Priority
//               </option>
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="dueDate"
//               className="block text-gray-700 text-sm font-medium mb-2"
//             >
//               Due Date
//             </label>
//             <input
//               id="dueDate"
//               name="dueDate"
//               type="datetime-local"
//               value={formData.dueDate}
//               onChange={handleDueDateChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
//         >
//           Add Task
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddTask;

