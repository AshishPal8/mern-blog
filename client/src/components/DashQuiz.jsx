import React, { useState } from "react";
import Quiz from "./Quiz";
import Questions from "./Questions";
import { Button } from "flowbite-react";

const DashQuiz = () => {
  const [showQuiz, setShowQuiz] = useState(true);

  const handleButtonClick = () => {
    setShowQuiz(!showQuiz);
  };

  return (
    <div className="w-full">
      <div className=" flex flex-col md:flex-row gap-5 p-2">
        <Button className="w-full" onClick={handleButtonClick}>
          Quiz
        </Button>
        <Button className="w-full" onClick={handleButtonClick}>
          Questions
        </Button>
      </div>
      {showQuiz ? <Questions /> : <Quiz />}
    </div>
  );
};

export default DashQuiz;
