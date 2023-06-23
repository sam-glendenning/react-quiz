import {
  type RenderResult,
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import App from "./App";
import { createTestQueryClient } from "./setupTests";
import { QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import testQuestions from "./testQuestions.json";
import axios, { type AxiosResponse } from "axios";

describe("App", () => {
  const createView = (): RenderResult =>
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <App />
      </QueryClientProvider>
    );

  beforeEach(() => {
    axios.get = jest
      .fn()
      .mockImplementation((url: string): Promise<Partial<AxiosResponse>> => {
        return Promise.resolve({ data: testQuestions });
      });
  });

  it("renders with a default of 10 questions", async () => {
    createView();

    const user = userEvent.setup();
    const startButton = screen.getByRole("button", { name: "Start" });
    await act(async () => {
      await user.click(startButton);
    });
    await waitForElementToBeRemoved(screen.queryByText("Loading..."));
    expect(screen.getByText("Question 10")).toBeInTheDocument();
  });
});
