import { Button } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchUserScore } from "../redux/quiz/userAnswerSlice";

const QuizResult = () => {
  const dispatch = useDispatch();
  const { quizId } = useParams();
  const { score } = useSelector((state) => state.userAnswers);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && quizId) {
      dispatch(fetchUserScore({ userId: currentUser.id, quizId }));
    }
  }, [dispatch, currentUser, quizId]);

  return (
    <div className="bg-[#F4F7FE] dark:bg-[#1E2142] min-h-[60vh]">
      <div className="p-3 flex items-center justify-center flex-col max-w-6xl mx-auto">
        <div className="my-5 p-4 border-[1px] dark:border-[rgba(168,179,207,.16)] w-[50%] rounded-2xl dark:hover:bg-[rgba(168,179,207,.08)]">
          <div className="flex justify-between mb-4">
            <span>Username: </span>
            <span>{currentUser.username}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Questions: </span>
            <span>05</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Attempts: </span>
            <span>03</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Earned points: </span>
            <span>{score}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Quiz result: </span>
            <span>{score >= 30 ? "Passed" : "Failed"}</span>
          </div>
        </div>

        <Link to={"/"}>
          <Button gradientDuoTone={"purpleToPink"} outline>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
