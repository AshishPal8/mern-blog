import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LeaderBoard = () => {
  const [quizzes, setQuizzes] = useState([]);
  console.log(quizzes);

  useEffect(() => {
    fetchActiveQuizzes();
  }, []);

  const fetchActiveQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes/active-quizzes");
      if (!res.ok) {
        throw new Error("Failed to fetch active quizzes");
      }
      const data = await res.json();
      setQuizzes(data.quizzes);
    } catch (error) {
      console.log("Error fetching active quizzes", error);
    }
  };

  return (
    <div className="bg-[#F4F7FE] dark:bg-[#1E2142] min-h-screen">
      <div>
        {quizzes.length > 0 && (
          <div className="p-3 flex flex-col items-center max-w-6xl mx-auto">
            <h1 className="text-3xl lg:text-5xl mt-2 p-3 text-left font-serif font-semibold mx-auto">
              {quizzes[0].name}
            </h1>
            <p className="p-3 text-left font-serif font-semibold mx-auto">
              {quizzes[0].description}
            </p>
            <div className="w-full h-[300px] ">
              <img
                src={quizzes[0].banner}
                alt={quizzes[0].name}
                className="object-cover bg-center max-h-[300px] w-full"
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-center my-5">
          <Link to={"/play-quiz"}>
            <Button gradientDuoTone={"purpleToPink"} outline>
              Play now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
