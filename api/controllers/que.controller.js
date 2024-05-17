import Question from "../models/que.model.js";
import { errorHandler } from "../utils/error.js";

export const createQuestions = async (req, res, next) => {
  try {
    const { questionText, options, correctOption } = req.body;

    const newQuestion = new Question({
      questionText,
      options,
      correctOption,
    });

    const savedQuestion = await newQuestion.save();

    return res
      .status(200)
      .json({ message: "Questions Saved Successfully", savedQuestion });
  } catch (error) {
    next(error);
  }
};

export const getQuestions = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see the questions"));
  }

  try {
    const questions = await Question.find();

    return res.json({ message: "Questions fetched successfully", questions });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete question"));
  }

  try {
    const deletedQuestion = await Question.findByIdAndDelete(
      req.params.questionId
    );
    if (!deletedQuestion) {
      return res.status(404).json("Question not found");
    }
    res
      .status(200)
      .json({ message: "Question deleted successfully", deletedQuestion });
  } catch (error) {
    next(error);
  }
};
