import express from "express";
import { verifyToken } from '../auth.js';
import { postComment, getComments } from '../apis/comment.js';

const router = express.Router();

router.post('/:tourId', verifyToken, postComment);
router.get('/:tourId', getComments);
export default router;