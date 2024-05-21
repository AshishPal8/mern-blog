import express from "express";
import {
  saveUserAnswers,
  calculateScore,
} from "../controllers/userAnswer.controller.js";

const router = express.Router();

router.post("/bulk", saveUserAnswers);
router.get("/score/:userId/:quizId", calculateScore);

export default router;
