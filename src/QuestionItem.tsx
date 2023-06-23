import React from "react";
import { type Question } from "./App";
import { Button } from "@mui/material";

interface QuestionItemProps {
  question: Question;
  questionNumber: number;
  alertQuestionAnswered: () => void;
  alertQuestionAnsweredCorrectly: () => void;
}

const generateAnswerOrder = (
  type: string,
  correct_answer: string,
  incorrect_answers: string[]
): string[] => {
  if (type === "boolean") {
    return ["True", "False"];
  }

  const answerOrder = [...incorrect_answers];
  const randomQuestionPosition = Math.floor(Math.random() * 4);
  answerOrder.splice(randomQuestionPosition, 0, correct_answer);
  return answerOrder;
};

const QuestionItem = (props: QuestionItemProps): React.ReactElement => {
  const {
    question,
    questionNumber,
    alertQuestionAnswered,
    alertQuestionAnsweredCorrectly,
  } = props;
  const {
    type,
    question: questionText,
    correct_answer,
    incorrect_answers,
  } = question;

  const [questionAnswered, setQuestionAnswered] =
    React.useState<boolean>(false);

  const [answerOrder] = React.useState<string[]>(
    generateAnswerOrder(type, correct_answer, incorrect_answers)
  );

  const handleSelectAnswer = (answer: string) => {
    setQuestionAnswered(true);
    alertQuestionAnswered();
    if (correct_answer === answer) {
      alertQuestionAnsweredCorrectly();
    }
  };

  return (
    <div>
      <h3>Question {questionNumber}</h3>
      <p>{questionText}</p>
      {answerOrder.map((answer, i) => {
        const answeredBackgroundColor =
          answer === correct_answer ? "green" : "red";

        return (
          <Button
            key={i}
            disabled={questionAnswered}
            sx={{
              "&.Mui-disabled": {
                color: answeredBackgroundColor,
              },
            }}
            onClick={() => handleSelectAnswer(answer)}
          >
            {answer}
          </Button>
        );
      })}
    </div>
  );
};

export default QuestionItem;
