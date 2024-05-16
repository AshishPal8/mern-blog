import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createQuestions,
  deleteQuestion,
  getQuestions,
} from "../controllers/quiz.controller.js";

const router = express.Router();

router.post("/create-que", verifyToken, createQuestions);
router.get("/getque", verifyToken, getQuestions);
router.delete("/delete-que/:questionId", verifyToken, deleteQuestion);

export default router;
