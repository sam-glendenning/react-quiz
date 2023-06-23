import React from "react";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import QuestionItem from "./QuestionItem";
import Stopwatch from "./Stopwatch";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

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

const useQuestions = (
  quizStart: boolean,
  numberOfQuestions: number
): UseQueryResult<QuestionsResponse, AxiosError> =>
  useQuery<
    QuestionsResponse,
    AxiosError,
    QuestionsResponse,
    [string, { numberOfQuestions: number }]
  >(
    ["questions", { numberOfQuestions }],
    () => {
      return axios
        .get(`https://opentdb.com/api.php?amount=${numberOfQuestions}`)
        .then((response) => response.data);
    },
    { enabled: quizStart }
  );

const App = () => {
  const [questions, setQuestions] = React.useState<Question[]>([]);

  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] =
    React.useState<number>(10);

  const [questionsAnswered, setQuestionAnswered] = React.useState<number>(0);
  const [questionsAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    React.useState<number>(0);
  const [quizState, setQuizState] = React.useState<
    "not started" | "loading" | "started" | "ended"
  >("not started");

  const { data, isLoading } = useQuestions(
    quizState === "loading",
    selectedNumberOfQuestions
  );

  React.useEffect(() => {
    if (!isLoading && data) {
      setQuestions(data.results);
      handleStopwatchStart();
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
    setQuizState("loading");
  };

  const handleStopwatchStart = () => {
    setQuizState("started");
  };

  const handleStop = () => {
    setQuizState("ended");
  };

  React.useEffect(() => {
    if (questionsAnswered === selectedNumberOfQuestions) {
      handleStop();
    }
  }, [questionsAnswered, selectedNumberOfQuestions]);

  return (
    <div className="App">
      <header>Sam's Big Fat Quiz</header>
      <br />
      <br />
      {quizState === "not started" && (
        <FormControl sx={{ width: "200px" }}>
          <InputLabel>Number of questions</InputLabel>
          <Select
            value={selectedNumberOfQuestions}
            label="Number of questions"
            onChange={(e) =>
              setSelectedNumberOfQuestions(e.target.value as number)
            }
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
          <Button onClick={() => handleStart()}>Start</Button>
        </FormControl>
      )}
      {quizState === "loading" && <p>Loading...</p>}
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
              <p>{`Correct: ${questionsAnsweredCorrectly}/${selectedNumberOfQuestions}`}</p>
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
      <br />
      <br />
    </div>
  );
};

export default App;
