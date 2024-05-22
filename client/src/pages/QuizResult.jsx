import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const QuizResult = () => {
  const { quizId } = useParams();
  const quizzes = useSelector((state) => state.quizzes.items);
  const [score, setScore] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchScore = async () => {
      if (currentUser && quizzes) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/user-answers/score/${currentUser._id}/${quizzes[0]._id}`
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Something went wrong");
          }
          const data = await response.json();
          setScore(data.score);
          setTotalAttempts(data.totalAttempts);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchScore();
  }, [currentUser]);

  const totalQuestion = quizzes[0].questions.length;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            <span>{totalQuestion}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Attempt question: </span>
            <span>{totalAttempts}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Earned points: </span>
            <span>{score !== null ? score : "Loading..."}</span>
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
