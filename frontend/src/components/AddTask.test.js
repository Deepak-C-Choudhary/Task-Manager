import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddTask from "./AddTask";

// Mock the `postData` function
jest.mock("./AddTask", () => ({
  ...jest.requireActual("./AddTask"),
  postData: jest.fn(),
}));

describe("AddTask Component", () => {
  const mockOnTaskAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all form fields", () => {
    render(<AddTask onTaskAdded={mockOnTaskAdded} />);

    // Check form fields
    expect(screen.getByLabelText("Task Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();

    // Check button
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  it("should update the form fields when values are entered", () => {
    render(<AddTask onTaskAdded={mockOnTaskAdded} />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText("Task Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "This is a test description" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2024-12-31T12:00" },
    });

    // Assert the form values
    expect(screen.getByLabelText("Task Title")).toHaveValue("Test Task");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "This is a test description"
    );
    expect(screen.getByLabelText("Priority")).toHaveValue("high");
    expect(screen.getByLabelText("Due Date")).toHaveValue("2024-12-31T12:00");
  });

  it("should show an alert for invalid due date", () => {
    // Mock window.alert
    window.alert = jest.fn();

    render(<AddTask onTaskAdded={mockOnTaskAdded} />);

    // Set an invalid date
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2020-01-01T00:00" },
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Please select a future date and time."
    );
  });

  it("should call `onTaskAdded` when the form is submitted", async () => {
    render(<AddTask onTaskAdded={mockOnTaskAdded} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Task Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "medium" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2024-12-31T12:00" },
    });

    // Simulate form submission
    const submitButton = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(submitButton);

    // Assert that the `onTaskAdded` callback is called
    expect(mockOnTaskAdded).toHaveBeenCalled();
  });

  it("should reset the form fields after successful submission", () => {
    render(<AddTask onTaskAdded={mockOnTaskAdded} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Task Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "low" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2024-12-31T12:00" },
    });

    // Simulate form submission
    const submitButton = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(submitButton);

    // Assert form is reset
    expect(screen.getByLabelText("Task Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Priority")).toHaveValue("");
    expect(screen.getByLabelText("Due Date")).toHaveValue("");
  });

  it("should display an error message if API call fails", async () => {
    const mockError = new Error("API Error");
    jest.spyOn(global, "fetch").mockRejectedValueOnce(mockError);

    render(<AddTask onTaskAdded={mockOnTaskAdded} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Task Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "low" },
    });
    fireEvent.change(screen.getByLabelText("Due Date"), {
      target: { value: "2024-12-31T12:00" },
    });

    // Simulate form submission
    const submitButton = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(submitButton);

    // Assert error handling
    expect(
      screen.getByText(
        "An error occurred while adding the task. Please try again."
      )
    ).toBeInTheDocument();
  });
});
