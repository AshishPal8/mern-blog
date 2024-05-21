import Quiz from "../models/quiz.model.js";
import Question from "../models/que.model.js";
import { errorHandler } from "../utils/error.js";

export const createQuiz = async (req, res, next) => {
  try {
    const { name, description, banner, questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return next(errorHandler(400, "Questions are required"));
    }

    const validQuestions = await Question.find({
      _id: {
        $in: questions,
      },
    });

    if (validQuestions.length !== questions.length) {
      return next(errorHandler(400, "Invalid questions provided"));
    }

    const newQuiz = new Quiz({
      name,
      description,
      banner,
      questions,
    });

    const savedQuiz = await newQuiz.save();
    return res
      .status(200)
      .json({ message: "Quiz created successfully", savedQuiz });
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see the quizzes"));
  }
  try {
    const quizzes = await Quiz.find().populate("questions");
    return res
      .status(200)
      .json({ message: "Quizzes fetched successfully", quizzes });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete the quiz"));
  }

  try {
    const deleteQuiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!deleteQuiz) {
      return res.status(403).json({ error: "Quiz not found" });
    }

    return res.status(200).json({ message: "Quiz is deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const toggleActiveQuiz = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to activate the quiz"));
  }

  const { quizId } = req.params;

  try {
    await Quiz.updateMany({}, { active: false });

    // Activate the selected quiz
    const activatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { active: true },
      { new: true }
    );

    if (!activatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res
      .status(200)
      .json({ message: "Quiz activated successfully", activatedQuiz });
  } catch (error) {
    next(error);
  }
};

export const getActiveQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ active: true }).populate("questions");
    return res
      .status(200)
      .json({ message: "Active quizzes fetched successfully", quizzes });
  } catch (error) {
    next(error);
  }
};
