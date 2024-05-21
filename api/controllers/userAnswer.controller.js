import UserAnswer from "../models/userAnswer.model.js";
import Question from "../models/que.model.js";

export const saveUserAnswers = async (req, res, next) => {
  const { userId, quizId, answers } = req.body;

  try {
    const userAnswers = await Promise.all(
      answers.map(async (answer) => {
        const question = await Question.findById(answer.questionId);
        const isCorrect = question.correctOption === answer.selectedOption;

        return {
          userId,
          quizId,
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect,
        };
      })
    );

    await UserAnswer.insertMany(userAnswers);
    res.status(200).json({ message: "User answers saved successfully" });
  } catch (error) {
    next(error);
  }
};

export const calculateScore = async (req, res, next) => {
  const { userId, quizId } = req.params;

  try {
    const userAnswers = await UserAnswer.find({ userId, quizId });
    const score = userAnswers.reduce((total, answer) => {
      return total + (answer.isCorrect ? 10 : 0);
    }, 0);

    res.status(200).json({ score });
  } catch (error) {
    next(error);
  }
};
