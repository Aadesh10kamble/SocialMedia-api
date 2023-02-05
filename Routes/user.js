import express from 'express';
import { signUp, login, updateProfile, verifyToken, followUser,getUser } from '../auth.js';
import { collectPhotos } from '../apis/multerFiles.js';
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.patch('/profile', verifyToken, collectPhotos, updateProfile);
router.put('/following/:userId', verifyToken, followUser);
router.get('/:userId',getUser);
router.get('/getUser', verifyToken, (req, res) => res.status(200).json({ isSuccess: true, data: req.user }));

export default router;