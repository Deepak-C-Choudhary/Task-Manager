import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskItem from "./TaskItem";

describe("TaskItem Component", () => {
  const mockTask = {
    _id: "123",
    title: "Test Task",
    description: "This is a test description",
    priority: "medium",
    dueDate: "2024-12-31T23:59:00.000Z",
    completed: false,
  };

  const mockOnTaskUpdated = jest.fn();
  const mockOnTaskDeleted = jest.fn();

  const setup = () =>
    render(
      <TaskItem
        task={mockTask}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders task details correctly", () => {
    setup();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("This is a test description")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toHaveTextContent("Dec 31, 2024");
  });

  it("calls toggleComplete when checkbox is clicked", async () => {
    setup();

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockOnTaskUpdated).toHaveBeenCalledTimes(1);
      expect(mockOnTaskUpdated).toHaveBeenCalledWith({
        ...mockTask,
        completed: true,
      });
    });
  });

  it("enters edit mode when Edit button is clicked", () => {
    setup();

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByLabelText("Title")).toHaveValue("Test Task");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "This is a test description"
    );
    expect(screen.getByLabelText("Priority")).toHaveValue("medium");
  });

  it("saves changes and exits edit mode", async () => {
    setup();

    fireEvent.click(screen.getByText("Edit"));

    const titleInput = screen.getByLabelText("Title");
    const descriptionInput = screen.getByLabelText("Description");

    fireEvent.change(titleInput, { target: { value: "Updated Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Updated description" },
    });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockOnTaskUpdated).toHaveBeenCalledWith({
        ...mockTask,
        title: "Updated Task",
        description: "Updated description",
      });
    });
  });

  it("calls onTaskDeleted when Delete button is clicked", async () => {
    setup();

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockOnTaskDeleted).toHaveBeenCalledTimes(1);
      expect(mockOnTaskDeleted).toHaveBeenCalledWith(mockTask._id);
    });
  });

  it("cancels edit mode without saving changes", () => {
    setup();

    fireEvent.click(screen.getByText("Edit"));

    const titleInput = screen.getByLabelText("Title");
    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
    expect(mockOnTaskUpdated).not.toHaveBeenCalled();
  });
});
