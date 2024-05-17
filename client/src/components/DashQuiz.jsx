import { useState } from "react";
import Quiz from "./Quiz";
import Questions from "./Questions";
import { Button } from "flowbite-react";

const DashQuiz = () => {
  const [activeComponent, setActiveComponent] = useState("quiz");

  const handleQuizClick = () => {
    setActiveComponent("quiz");
  };

  const handleQuestionsClick = () => {
    setActiveComponent("questions");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-5 p-2">
        <Button
          className={`w-full ${
            activeComponent === "quiz" ? "bg-blue-500" : ""
          }`}
          onClick={handleQuizClick}
          disabled={activeComponent === "quiz"}
        >
          Quiz
        </Button>
        <Button
          className={`w-full ${
            activeComponent === "questions" ? "bg-blue-500" : ""
          }`}
          onClick={handleQuestionsClick}
          disabled={activeComponent === "questions"}
        >
          Questions
        </Button>
      </div>
      {activeComponent === "quiz" ? <Quiz /> : <Questions />}
    </div>
  );
};

export default DashQuiz;
