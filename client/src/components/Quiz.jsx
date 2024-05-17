import { Button, FileInput, Modal, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";

const Quiz = () => {
  const [showModel, setShowModel] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  console.log(questions);

  const handleCheckboxChange = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/quiz/getque");
      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await res.json();
      setQuestions(data.questions);
    } catch (error) {
      console.log("Error fetching questions", error);
    }
  };
  return (
    <div className="w-full flex items-center justify-center my-5">
      <Button
        onClick={() => setShowModel(true)}
        gradientDuoTone={"purpleToPink"}
        outline
      >
        Create new quiz
      </Button>

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size={"3xl"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-2xl dark:text-gray-400">
              Create new Quiz
            </h3>
            <form className="flex flex-col gap-2">
              <TextInput
                type="text"
                id="name"
                name="name"
                placeholder="Enter name"
              />
              <Textarea
                id="description"
                name="description"
                placeholder="Enter description"
              />
              <FileInput id="banner" name="banner" placeholder="Add Banner" />
              <div className="my-4">
                <h4 className="text-lg">Select Questions</h4>
                <div className="max-h-60 overflow-y-auto">
                  {questions.map((question) => (
                    <div key={question._id} className="flex items-center my-2">
                      <input
                        type="checkbox"
                        id={`question-${question._id}`}
                        className="mr-2"
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() => handleCheckboxChange(question._id)}
                      />
                      <label htmlFor={`question-${question._id}`}>
                        {question.questionText}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Button color={"gray"} onClick={() => setShowModel(false)}>
                  Cancel
                </Button>
                <Button color={"failure"} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Quiz;
