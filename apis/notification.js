import Notification from "../Models/Notification.js";

export const getNotification = async (req, res) => {
    const { user } = req;
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({ receiver: userId })
            .sort({ createAt: -1 });
        res.status(200).json({ isSuccess: true, data: notifications });
    } catch (err) {
        res.failure (err)
    }
};
