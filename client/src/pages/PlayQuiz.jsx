import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveQuizzes } from "../redux/quiz/quizzesSlice";
import {
  setUserAnswer,
  submitUserAnswers,
} from "../redux/quiz/userAnswerSlice";
import { useNavigate } from "react-router-dom";

const PlayQuiz = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quizzes.items);
  const userAnswers = useSelector((state) => state.userAnswers.answers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchActiveQuizzes());
  }, [dispatch]);

  const handleOptionChange = (questionId, option) => {
    dispatch(setUserAnswer({ questionId, option }));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleQuizSubmit = () => {
    const currentQuiz = quizzes[0];
    const userId = currentUser._id;
    const userAnswersData = currentQuiz.questions.map((question) => ({
      questionId: question._id,
      selectedOption: userAnswers[question._id],
      isCorrect: userAnswers[question._id] === question.correctOption,
    }));

    dispatch(
      submitUserAnswers({
        userId,
        quizId: currentQuiz._id,
        answers: userAnswersData,
      })
    );
    navigate("/quiz-result");
  };

  const currentQuiz = quizzes.length > 0 ? quizzes[0] : null;
  const currentQuestion = currentQuiz
    ? currentQuiz.questions[currentQuestionIndex]
    : null;

  return (
    <div className="bg-[#F4F7FE] dark:bg-[#1E2142] min-h-screen">
      {currentQuiz && (
        <div className="p-3 flex flex-col items-start justify-start max-w-4xl mx-auto">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">
              Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}
            </span>
            <span className="text-lg font-semibold">
              Total Questions: {currentQuiz.questions.length}
            </span>
          </div>
          {currentQuestion && (
            <>
              <div key={currentQuestion._id} className="min-h-[300px]">
                <h2 className="text-3xl lg:text-5xl mt-2 p-3 text-left font-serif font-semibold mx-auto">
                  {currentQuestion.questionText}
                </h2>
                <div className="flex flex-col gap-4 mt-3">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center justify-start gap-2"
                    >
                      <input
                        type="radio"
                        id={option}
                        name={`question-${currentQuestion._id}`}
                        value={option}
                        checked={userAnswers[currentQuestion._id] === option}
                        onChange={() =>
                          handleOptionChange(currentQuestion._id, option)
                        }
                        className="w-6 h-6"
                      />
                      <label className="text-2xl" htmlFor={option}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex items-center justify-between gap-10">
                <button
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                  <button
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                    onClick={handleNextQuestion}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleQuizSubmit}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayQuiz;
