
import React from "react";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
        <TaskList />
      </div>
    </div>
  );
}

export default App;