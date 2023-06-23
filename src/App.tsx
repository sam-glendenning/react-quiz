import React from "react";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import QuestionItem from "./QuestionItem";
import Stopwatch from "./Stopwatch";
import { Button } from "@mui/material";

export type Question = {
  category: string;
  type: "boolean" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

interface QuestionsResponse {
  response_code: number;
  results: Question[];
}

const useQuestions = (): UseQueryResult<QuestionsResponse, AxiosError> =>
  useQuery<QuestionsResponse, AxiosError, QuestionsResponse, [string]>(
    ["questions"],
    () => {
      return axios
        .get("https://opentdb.com/api.php?amount=10")
        .then((response) => response.data);
    },
    {}
  );

const App = () => {
  const { data, isLoading } = useQuestions();

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [questionsAnswered, setQuestionAnswered] = React.useState<number>(0);
  const [questionsAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    React.useState<number>(0);
  const [quizState, setQuizState] = React.useState<
    "loading" | "not started" | "started" | "ended"
  >("not started");

  React.useEffect(() => {
    if (!isLoading && data) {
      setQuestions(data.results);
    } else {
      setQuestions([]);
    }
  }, [isLoading, data]);

  const alertQuestionAnswered = () => {
    setQuestionAnswered((oldNumber) => oldNumber + 1);
  };

  const alertQuestionAnsweredCorrectly = () => {
    setQuestionAnsweredCorrectly((oldNumber) => oldNumber + 1);
  };

  const handleStart = () => {
    setQuizState("started");
  };

  const handleStop = () => {
    setQuizState("ended");
  };

  React.useEffect(() => {
    if (questionsAnswered === 10) {
      handleStop();
    }
  }, [questionsAnswered]);

  return (
    <div className="App">
      <header>Sam's Big Fat Quiz</header>
      <br />
      <br />
      {quizState === "loading" && <p>Loading...</p>}
      {quizState === "not started" && (
        <Button onClick={() => handleStart()}>Start</Button>
      )}
      {(quizState === "started" || quizState === "ended") && (
        <div>
          <Stopwatch active={quizState === "started"} />
          <div>
            {questions.map((question, i) => (
              <QuestionItem
                key={i}
                question={question}
                questionNumber={i + 1}
                alertQuestionAnswered={alertQuestionAnswered}
                alertQuestionAnsweredCorrectly={alertQuestionAnsweredCorrectly}
              />
            ))}
          </div>
          {quizState === "ended" && (
            <div>
              <p>{`Correct: ${questionsAnsweredCorrectly}/10`}</p>
              <p>{`Score required to pass: ${Math.ceil(
                questionsAnswered / 2
              )}/${questionsAnswered}`}</p>
              {questionsAnsweredCorrectly / questionsAnswered >= 0.5 ? (
                <p>You passed!</p>
              ) : (
                <p>You failed!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
