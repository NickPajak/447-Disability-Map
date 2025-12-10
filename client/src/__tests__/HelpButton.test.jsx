// src/__tests__/HelpButton.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpButton from "../components/HelpButton";
import FontSizeToggle from "../components/FontSizeToggle";
import "@testing-library/jest-dom";

// Mock toggleDarkMode function
const toggleDarkModeMock = jest.fn();

describe("HelpButton Component", () => {
  beforeEach(() => {
    document.body.style.fontSize = "";
    document.body.className = "";
  });

  test("renders Help button", () => {
    render(<HelpButton darkMode={false} toggleDarkMode={toggleDarkModeMock} />);
    const helpButton = screen.getByLabelText("Help");
    expect(helpButton).toBeInTheDocument();
  });

  test("opens and closes Help menu when Help button is clicked", () => {
    render(<HelpButton darkMode={false} toggleDarkMode={toggleDarkModeMock} />);
    const helpButton = screen.getByLabelText("Help");

    // Menu should not be in the document initially
    expect(screen.queryByText("Help Menu")).not.toBeInTheDocument();

    fireEvent.click(helpButton);
    expect(screen.getByText("Help Menu")).toBeInTheDocument();

    const closeButton = screen.getByLabelText("Close Help Menu");
    fireEvent.click(closeButton);
    expect(screen.queryByText("Help Menu")).not.toBeInTheDocument();
  });

  test("toggles dark mode when menu item clicked", () => {
    render(<HelpButton darkMode={false} toggleDarkMode={toggleDarkModeMock} />);
    fireEvent.click(screen.getByLabelText("Help"));

    const darkModeItem = screen.getByText("Switch to Dark Mode");
    fireEvent.click(darkModeItem);
    expect(toggleDarkModeMock).toHaveBeenCalledTimes(1);
  });

  test("FontSizeToggle changes document.body font size", async () => {
    render(<HelpButton darkMode={false} toggleDarkMode={toggleDarkModeMock} />);
    fireEvent.click(screen.getByLabelText("Help")); // open menu

    // Get the +/- buttons from the actual FontSizeToggle component
    const decreaseButton = screen.getByText("-");
    const increaseButton = screen.getByText("+");

    // Initial font size should be 16px
    await waitFor(() => {
      expect(document.body.style.fontSize).toBe("16px");
    });

    // Click "+" to increase font size
    fireEvent.click(increaseButton);
    await waitFor(() => {
      expect(document.body.style.fontSize).toBe("18px");
    });

    // Click "-" to decrease font size
    fireEvent.click(decreaseButton);
    await waitFor(() => {
      expect(document.body.style.fontSize).toBe("16px");
    });
  });

  test("adds and removes dark-mode class when darkMode prop changes", () => {
    const { rerender } = render(<HelpButton darkMode={false} toggleDarkMode={toggleDarkModeMock} />);
    
    expect(document.body.classList.contains("dark-mode")).toBe(false);

    rerender(<HelpButton darkMode={true} toggleDarkMode={toggleDarkModeMock} />);
    expect(document.body.classList.contains("dark-mode")).toBe(true);

    rerender(<HelpButton darkMode={false} toggleDarkMode={toggleDarkModeMock} />);
    expect(document.body.classList.contains("dark-mode")).toBe(false);
});

});
