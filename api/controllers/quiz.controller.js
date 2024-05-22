import Quiz from "../models/quiz.model.js";
import Question from "../models/que.model.js";
import { errorHandler } from "../utils/error.js";
import UserAnswer from "../models/userAnswer.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

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

export const getQuizStatistics = async (req, res, next) => {
  const { quizId } = req.params;

  try {
    const uniqueUserIds = await UserAnswer.distinct("userId", {
      quizId: new mongoose.Types.ObjectId(quizId),
    });
    const totalUsers = uniqueUserIds.length;

    // Aggregate the statistics for each user
    const userStats = await UserAnswer.aggregate([
      { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
      {
        $group: {
          _id: "$userId",
          totalAttempts: { $sum: 1 },
          correctAnswers: { $sum: { $cond: ["$isCorrect", 1, 0] } },
          incorrectAnswers: { $sum: { $cond: ["$isCorrect", 0, 1] } },
          score: { $sum: { $cond: ["$isCorrect", 10, 0] } },
          latestAttemptDate: { $first: "$latestAttemptDate" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$user.username",
          totalAttempts: 1,
          correctAnswers: 1,
          incorrectAnswers: 1,
          score: 1,
        },
      },
      {
        $sort: {
          score: -1,
          latestAttemptDate: -1,
        },
      },
    ]);

    const highestScoreUser = userStats.length > 0 ? userStats[0] : null;

    res
      .status(200)
      .json({ totalUsers, userScores: userStats, highestScoreUser });
  } catch (error) {
    next(error);
  }
};
