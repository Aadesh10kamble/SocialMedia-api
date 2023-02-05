import express from 'express';
import { verifyToken } from '../auth.js';
import {
    getAllTours,
    createTour,
    getRequestedTour,
    addToLikedPosts
} from '../apis/tour.js';
import { collectPhotos } from '../apis/multerFiles.js';

const router = express.Router();

router.route('')
    .get(getAllTours)
    .post(verifyToken, collectPhotos, createTour);

router.route('/likedPosts/:tourId')
    .post(verifyToken, addToLikedPosts);

router.route('/:tourId')
    .get(getRequestedTour);


export default router;
