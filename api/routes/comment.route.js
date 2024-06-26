import express from "express";
import {
  createcomment,
  getComments,
  getpostcomment,
  likeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createcomment);
router.get("/getPostComment/:postId", getpostcomment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.get("/getcomments", verifyToken, getComments);

export default router;
