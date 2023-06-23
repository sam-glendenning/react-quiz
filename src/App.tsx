import React from "react";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";

type Question = {
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

const useQuestions = (): UseQueryResult<QuestionsResponse, Error> =>
  useQuery<QuestionsResponse, Error, QuestionsResponse, [string]>(
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

  React.useEffect(() => {
    if (!isLoading && data) {
      setQuestions(data.results);
    } else {
      setQuestions([]);
    }
  }, [isLoading, data]);

  return (
    <div className="App">
      <header>Quiz</header>
      {questions.length === 0 ? (
        <p>Loading...</p>
      ) : (
        questions.map((question, i) => (
          <div>
            <h3>Question {i + 1}</h3>
            <p>{question.question}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
