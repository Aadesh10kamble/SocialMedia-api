import Comment from "../Models/Comment.js";

export const postComment = async (req, res) => {
    const { user } = req;
    const { tourId } = req.params;
    const { comment } = req.body;
    try {
        if (!user) throw new Error('no user');
        if (!tourId) throw new Error('no TourId');
        if (!comment) throw new Error('no comment');
        const newComment = await Comment.create({ user, comment, tour: tourId });
        res.status(200).json({ isSuccess: true, data: newComment });
    } catch (error) {
        res.status(200).json({ isSuccess: false, error: error.message });
    }
}

export const getComments = async (req,res) => {
    const {tourId} = req.params;
    try {
        const comments = await Comment.find ({tour : tourId});
        if (!comments) throw new Error ('no comments found');
        res.status (200).json ({isSuccess : true,data : comments});
    } catch (error) {
        res.status (200).json ({isSuccess : false,error : error.message});
    }
};

