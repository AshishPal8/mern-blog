import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createQuiz,
  deleteQuiz,
  toggleActiveQuiz,
  getQuiz,
  getActiveQuizzes,
  getQuizStatistics,
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.post("/create-quiz", verifyToken, createQuiz);
router.get("/getquiz", verifyToken, getQuiz);
router.delete("/delete-quiz/:quizId", verifyToken, deleteQuiz);
router.put("/activate-quiz/:quizId", verifyToken, toggleActiveQuiz);
router.get("/active-quizzes", getActiveQuizzes);
router.get("/statistics/:quizId", getQuizStatistics);

export default router;
