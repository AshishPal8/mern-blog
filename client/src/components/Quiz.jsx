import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Accordion,
  Alert,
  Button,
  FileInput,
  Modal,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

const Quiz = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner: "",
    questions: [],
  });
  const [showModel, setShowModel] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [quizStatistics, setQuizStatistics] = useState({});

  const handleCheckboxChange = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  useEffect(() => {
    fetchQuestions();
    fetchQuizzesAndStatistics();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();

    const quizData = { ...formData, questions: selectedQuestions };
    try {
      const res = await fetch("/api/quizzes/create-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(quizData),
      });

      if (!res.ok) {
        throw new Error("Failed to create questions");
      }

      const data = await res.json();

      setFormData({
        name: "",
        description: "",
        questions: [],
      });

      setSelectedQuestions([]);

      setShowModel(false);
      fetchQuizzes();
    } catch (error) {
      console.log("Error submiting quiz", error);
    }
  };
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage();
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed());
        },
        (error) => {
          setImageUploadError("Image upload failed", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downladURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, banner: downladURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError(null);
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const fetchQuizzesAndStatistics = async () => {
    try {
      const res = await fetch("/api/quizzes/getquiz");
      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await res.json();
      setQuizzes(data.quizzes);

      // Fetch statistics for each quiz
      const statsPromises = data.quizzes.map((quiz) =>
        fetchQuizStatistics(quiz._id)
      );
      const stats = await Promise.all(statsPromises);

      const statsMap = data.quizzes.reduce((acc, quiz, idx) => {
        acc[quiz._id] = stats[idx];
        return acc;
      }, {});
      setQuizStatistics(statsMap);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const fetchQuizStatistics = async (quizId) => {
    try {
      const res = await fetch(`/api/quizzes/statistics/${quizId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch quiz statistics");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Error fetching quiz statistics", error);
      return null;
    }
  };

  const handleDeleteQuestion = async (quizId) => {
    try {
      const res = await fetch(`/api/quizzes/delete-quiz/${quizId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete quiz");
      }

      fetchQuizzes();
    } catch (error) {
      console.log("Error deleting the quiz", error);
    }
  };

  const handleActivateQuiz = async (quizId) => {
    try {
      const res = await fetch(`/api/quizzes/activate-quiz/${quizId}`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to activate quiz");
      }

      fetchQuizzes();
    } catch (error) {
      console.log("Error activating the quiz", error);
    }
  };

  return (
    <div className="my-5 mx-8">
      <div className="w-full flex items-center justify-between my-5">
        <h1 className="text-4xl">Quizzes</h1>
        <Button
          onClick={() => setShowModel(true)}
          gradientDuoTone={"purpleToPink"}
          outline
        >
          Create new quiz
        </Button>
      </div>

      <div>
        {quizzes.length === 0 ? (
          <p>No Quizzes Available</p>
        ) : (
          <Accordion>
            {quizzes.map((quiz) => (
              <Accordion.Panel
                key={quiz._id}
                onClick={() => fetchQuizStatistics(quiz._id)}
              >
                <Accordion.Title>{quiz.name}</Accordion.Title>
                <Accordion.Content>
                  <ol>
                    {quiz.questions.map((question, index) => (
                      <li key={index}>{question.questionText}</li>
                    ))}
                  </ol>
                  <div className="flex gap-5 mt-4">
                    <span
                      onClick={() => handleDeleteQuestion(quiz._id)}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                    <span
                      onClick={() => handleActivateQuiz(quiz._id)}
                      className={`font-medium hover:underline cursor-pointer ${
                        quiz.active ? "text-gray-500" : "text-green-500"
                      }`}
                    >
                      {quiz.active ? "Deactivate" : "Activate"}
                    </span>
                  </div>

                  <Table hoverable className="mt-4">
                    <Table.Head>
                      <Table.HeadCell>Username</Table.HeadCell>
                      <Table.HeadCell>Attempt Que</Table.HeadCell>
                      <Table.HeadCell>Correct Que</Table.HeadCell>
                      <Table.HeadCell>Incorrect Que</Table.HeadCell>
                      <Table.HeadCell>Score</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {quizStatistics[quiz._id] ? (
                        quizStatistics[quiz._id].userScores.map((userScore) => (
                          <Table.Row key={userScore._id}>
                            <Table.Cell>{userScore.username}</Table.Cell>
                            <Table.Cell>{userScore.totalAttempts}</Table.Cell>
                            <Table.Cell>{userScore.correctAnswers}</Table.Cell>
                            <Table.Cell>
                              {userScore.incorrectAnswers}
                            </Table.Cell>
                            <Table.Cell>{userScore.score}</Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <Table.Row>
                          <Table.Cell colSpan="5">Loading...</Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        )}
      </div>

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
            <form className="flex flex-col gap-2" onSubmit={handleQuizSubmit}>
              <TextInput
                type="text"
                id="name"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
              />
              <Textarea
                id="description"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
              />
              <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput
                  type="file"
                  accept="image/*"
                  id="banner"
                  name="banner"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientDuoTone={"purpleToBlue"}
                  size={"sm"}
                  outline
                  onClick={handleUploadImage}
                  disabled={imageUploadProgress}
                >
                  {imageUploadProgress ? (
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={imageUploadProgress}
                        text={`${imageUploadProgress || 0}%`}
                      />
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </div>
              {imageUploadError && (
                <Alert color={"failure"}>{imageUploadError}</Alert>
              )}
              {file && <img src={formData.banner} alt={formData.name} />}
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
