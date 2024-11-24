import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import axios from "axios";
import TaskList from "./TaskList";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

// Mock axios module
jest.mock("axios");

describe("TaskList Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should display loading state initially", () => {
    render(<TaskList />);
    expect(screen.getByText(/loading tasks.../i)).toBeInTheDocument();
  });

  test("should display error message if task fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch tasks"));

    render(<TaskList />);

    // Wait for loading state to finish
    await waitFor(() =>
      expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument()
    );

    // Expect error message
    expect(
      screen.getByText(/Failed to load tasks. Please try again later./i)
    ).toBeInTheDocument();
  });

  test("should display tasks after successful fetch", async () => {
    const tasks = [
      { _id: "1", title: "Test Task 1", completed: false, priority: "high" },
      { _id: "2", title: "Test Task 2", completed: true, priority: "low" },
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });

    render(<TaskList />);

    // Wait for tasks to load
    await waitFor(() =>
      expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument()
    );

    // Check if tasks are rendered
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  test("should filter tasks based on filter", async () => {
    const tasks = [
      { _id: "1", title: "Test Task 1", completed: false, priority: "high" },
      { _id: "2", title: "Test Task 2", completed: true, priority: "low" },
      { _id: "3", title: "Test Task 3", completed: false, priority: "medium" },
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });

    render(<TaskList />);

    // Wait for tasks to load
    await waitFor(() =>
      expect(screen.queryByText(/loading tasks.../i)).not.toBeInTheDocument()
    );

    // Test "All" filter (default)
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    expect(screen.getByText("Test Task 3")).toBeInTheDocument();

    // Filter by "Completed"
    fireEvent.click(screen.getByText(/completed/i));
    expect(screen.queryByText("Test Task 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Task 3")).not.toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();

    // Filter by "Pending"
    fireEvent.click(screen.getByText(/pending/i));
    expect(screen.queryByText("Test Task 2")).not.toBeInTheDocument();
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 3")).toBeInTheDocument();
  });

  test("should add a new task", async () => {
    const newTask = {
      _id: "3",
      title: "New Task",
      completed: false,
      priority: "medium",
    };
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({ data: newTask });

    render(<TaskList />);

    // Add a new task
    fireEvent.change(screen.getByLabelText(/task title/i), {
      target: { value: "New Task" },
    });
    fireEvent.click(screen.getByText(/add task/i));

    // Wait for task list to update
    await waitFor(() =>
      expect(screen.getByText("New Task")).toBeInTheDocument()
    );
  });

  test("should update a task", async () => {
    const updatedTask = {
      _id: "1",
      title: "Updated Task 1",
      completed: true,
      priority: "high",
    };
    const tasks = [
      { _id: "1", title: "Test Task 1", completed: false, priority: "high" },
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });
    axios.put.mockResolvedValueOnce({ data: updatedTask });

    render(<TaskList />);

    // Wait for task to load
    await waitFor(() =>
      expect(screen.getByText("Test Task 1")).toBeInTheDocument()
    );

    // Simulate task update
    fireEvent.click(screen.getByText("Test Task 1"));
    fireEvent.click(screen.getByText("Complete"));

    // Wait for task to update
    await waitFor(() =>
      expect(screen.getByText("Updated Task 1")).toBeInTheDocument()
    );
  });

  test("should delete a task", async () => {
    const tasks = [
      { _id: "1", title: "Test Task 1", completed: false, priority: "high" },
    ];
    axios.get.mockResolvedValueOnce({ data: tasks });
    axios.delete.mockResolvedValueOnce({ data: {} });

    render(<TaskList />);

    // Wait for task to load
    await waitFor(() =>
      expect(screen.getByText("Test Task 1")).toBeInTheDocument()
    );

    // Simulate task deletion
    fireEvent.click(screen.getByText("Delete"));

    // Wait for task to be removed from the list
    await waitFor(() =>
      expect(screen.queryByText("Test Task 1")).not.toBeInTheDocument()
    );
  });
});
