import React from "react";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import QuestionItem from "./QuestionItem";

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
  const [questionsAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    React.useState<number>(0);

  React.useEffect(() => {
    if (!isLoading && data) {
      setQuestions(data.results);
    } else {
      setQuestions([]);
    }
  }, [isLoading, data]);

  const alertQuestionAnsweredCorrectly = () => {
    setQuestionAnsweredCorrectly((oldNumber) => oldNumber + 1);
  };

  return (
    <div className="App">
      <header>Quiz</header>
      {questions.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>{`Correct: ${questionsAnsweredCorrectly}/10`}</p>
          {questions.map((question, i) => (
            <QuestionItem
              key={i}
              question={question}
              questionNumber={i + 1}
              alertQuestionAnsweredCorrectly={alertQuestionAnsweredCorrectly}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
