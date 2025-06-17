import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OpenAIComponent from "../OpenAIComponent";
import "@testing-library/jest-dom";
import { getOpenAIResponse } from "../../services/openaiService";
import { act } from "react-dom/test-utils";

jest.mock("../../services/openaiService");

describe("OpenAIComponent", () => {
    it("displays the Red Cross PDF link", () => {
      render(<OpenAIComponent />);
      const link = screen.getByRole("link", { name: /Red Cross First Aid Steps/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        "https://www.redcross.org/content/dam/redcross/training-services/course-fact-sheets/RTE-Textbook-Sample.pdf"
      );
    });

    it("displays the medical disclaimer", () => {
      render(<OpenAIComponent />);
      expect(
        screen.getByText(
          /This app is not a substitute for professional medical advice/i
        )
      ).toBeInTheDocument();
    });
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
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /get response/i }));
    });
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
    await waitFor(() => expect(screen.getByText("Error")).toBeInTheDocument());
  });

  it("shows spinner during fetch and hides after", async () => {
    (getOpenAIResponse as jest.Mock).mockResolvedValue("Sample AI Reply");
    render(<OpenAIComponent />);
    fireEvent.change(screen.getByPlaceholderText("Type your prompt here..."), {
      target: { value: "Prompt" },
    });
    fireEvent.click(screen.getByRole("button", { name: /get response/i }));

    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByTestId("spinner")).not.toBeInTheDocument()
    );
  });

  it("does not call API on empty prompt", () => {
    render(<OpenAIComponent />);
    fireEvent.click(screen.getByRole("button", { name: /get response/i }));
    expect(getOpenAIResponse).not.toHaveBeenCalled();
  });
});

