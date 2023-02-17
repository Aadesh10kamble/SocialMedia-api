import Tour from "../Models/Tour.js";
import { createNotification } from "../notificationhelper.js";
import sharp from "sharp";
import _ from "underscore";

export const getAllTours = async (req, res) => {
    const queryFields = Object.create({});
    const { pageSize, pageNumber } = req.query;
    try {
        const tours = await Tour.find(queryFields)
            .populate({
                path: 'user',
                select: 'profilePic firstName lastName follower isOnline'
            });
        if (!tours) throw new Error('no tours found');
        res.status(200).json({ isSuccess: true, data: tours });
    } catch (error) {
        res.status(200).json({ isSuccess: false, error: error.message });
    }
};

export const getRequestedTour = async (req, res) => {
    const { tourId } = req.params;
    try {
        const tour = await Tour.findById(tourId).populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        if (!tour) throw new Error('no tour found');
        res.status(200).json({ isSuccess: true, data: tour });
    } catch (error) {
        res.status(200).json({ isSuccess: false, error: error.message });
    }
};

export const createTour = async (req, res) => {
    const { user } = req;
    const { caption } = req.body;
    try {
        Tour.create({ user: user._id, caption })
            .then(async tour => {
                const images = new Array();
                for (let image of req.files.images) {
                    const fileName = `${user._id}-${tour._id}-${image.originalname}`;
                    sharp(image.buffer).resize(500, 400)
                        .toFile(`${process.cwd()}/public/media/images/${fileName}`);
                    images.push(fileName);
                };
                tour.images = images;
                tour.save({ validateModifiedOnly: true }).then (async tour => {
                    res.status(200).json({ isSuccess: true, data: tour });
                });
            })
            .catch(err => { throw new Error(err) });
    } catch (error) {
        res.status(200).json({ isSuccess: false, error: error.message });
    }
};


export const addToLikedPosts = async (req, res) => {
    const { user } = req;
    const { tourId } = req.params;
    try {
        let isNotificationRequired = false;
        const tour = await Tour.findById(tourId);
        if (!tour) throw new Error('tour not found');

        const index = user.likedPosts.findIndex(tour => tour.toString() === tourId.toString());
        if (index >= 0) user.removeFromLiked(index, tour);
        else {
            user.addToLiked(index, tour);
            isNotificationRequired = true;
        };

        await user.save({ validateModifiedOnly: true })
            .then(async user => {
                await tour.save({ validateModifiedOnly: true });
                if (isNotificationRequired) createNotification('likedPost', tour.user, tour, { initiator: req.user.firstName });
                res.status(200).json({ isSuccess: true, data: user });
            });

    } catch (error) {
        console.log(error)
        res.status(200).json({ isSuccess: false, message: error.message });
    }
};
