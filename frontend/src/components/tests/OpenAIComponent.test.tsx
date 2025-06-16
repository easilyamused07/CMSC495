import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OpenAIComponent from "../OpenAIComponent";
import "@testing-library/jest-dom";
import { getOpenAIResponse } from "../../services/openaiService";

jest.mock("../../services/openaiService");

describe("OpenAIComponent", () => {
  beforeEach(() => {
    (getOpenAIResponse as jest.Mock).mockReset();
  });

  it("renders textarea and button", () => {
    render(<OpenAIComponent />);
    expect(
      screen.getByPlaceholderText("Type your prompt here...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get response/i })
    ).toBeInTheDocument();
  });

  it("displays AI response on success", async () => {
    (getOpenAIResponse as jest.Mock).mockResolvedValue("Sample AI Reply");
    render(<OpenAIComponent />);
    fireEvent.change(screen.getByPlaceholderText("Type your prompt here..."), {
      target: { value: "Prompt" },
    });
    fireEvent.click(screen.getByRole("button", { name: /get response/i }));
    await waitFor(() =>
      expect(screen.getByText("Sample AI Reply")).toBeInTheDocument()
    );
  });

  it("displays error on failure", async () => {
    (getOpenAIResponse as jest.Mock).mockResolvedValue(null);
    render(<OpenAIComponent />);
    fireEvent.change(screen.getByPlaceholderText("Type your prompt here..."), {
      target: { value: "Prompt" },
    });
    fireEvent.click(screen.getByRole("button", { name: /get response/i }));
    await waitFor(() =>
      expect(screen.getByText("Error")).toBeInTheDocument()
    );
  });
});
