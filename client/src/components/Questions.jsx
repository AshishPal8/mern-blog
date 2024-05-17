import { Button, Modal, TextInput, Accordion } from "flowbite-react";
import { useEffect, useState } from "react";

const Questions = () => {
  const [formData, setFormData] = useState({
    questionText: "",
    options: [],
    correctOption: "",
  });
  const [showModel, setShowModel] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [additionalOptions, setAdditionalOptions] = useState([]);

  const handleChange = (e) => {
    if (e.target.id === "options") {
      setFormData({ ...formData, options: e.target.value.split(",") });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleAddOption = () => {
    setAdditionalOptions([...additionalOptions, ""]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    if (index < newOptions.length) {
      newOptions[index] = value;
    } else {
      const additionalIndex = index - newOptions.length;
      const newAdditionalOptions = [...additionalOptions];
      newAdditionalOptions[additionalIndex] = value;
      setAdditionalOptions(newAdditionalOptions);
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const allOptions = [...formData.options, ...additionalOptions];
      const formDataWithAllOptions = { ...formData, options: allOptions };

      const res = await fetch("/api/quiz/create-que", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithAllOptions),
      });

      if (!res.ok) {
        throw new Error("Failed to create questions");
      }

      const data = await res.json();
      console.log("Questions created successfully:", data);

      setFormData({
        questionText: "",
        options: [],
        correctOption: "",
      });
      setAdditionalOptions([]);

      setShowModel(false);
      fetchQuestions();
    } catch (error) {
      console.error("Error creating questions:", error);
    }
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

  const handleDeleteQuestion = async (questionId) => {
    try {
      const res = await fetch(`/api/quiz/delete-que/${questionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete question");
      }

      console.log("Question deleted successfully");

      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="my-5 mx-8">
      <div className="my-4 flex justify-between">
        <h1 className="text-4xl">Questions</h1>
        <Button
          onClick={() => setShowModel(true)}
          gradientDuoTone={"purpleToPink"}
          outline
        >
          Add New
        </Button>
      </div>

      <Accordion>
        {questions.map((question, index) => (
          <Accordion.Panel key={index}>
            <Accordion.Title>{question.questionText}</Accordion.Title>
            <Accordion.Content>
              <ol>
                {question.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ol>
              <p className="text-green-600 text-xl font-semibold">
                Correct option: {question.correctOption}
              </p>
              <span
                onClick={() => handleDeleteQuestion(question._id)}
                className="font-medium text-red-500 hover:underline cursor-pointer"
              >
                Delete
              </span>
            </Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size={"lg"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-2xl dark:text-gray-400">Save Question</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <TextInput
                type="text"
                id="questionText"
                placeholder="Enter your question"
                value={formData.questionText}
                onChange={handleChange}
              />
              {additionalOptions.map((option, index) => (
                <TextInput
                  key={index}
                  type="text"
                  placeholder={`Enter option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
              <Button className="w-fit" onClick={handleAddOption}>
                +option
              </Button>
              <TextInput
                type="text"
                id="correctOption"
                placeholder="Enter Correct answer"
                value={formData.correctOption}
                onChange={handleChange}
              />
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

export default Questions;
