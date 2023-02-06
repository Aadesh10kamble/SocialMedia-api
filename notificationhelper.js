import Notification from "./Models/Notification.js";
import { getUserSocket } from "./socketConfiguration.js";

export const createNotification = (type, receiver, regarding, contentData = {}) => {
    const content = notificationContent(type, contentData);
    Notification.create({ type, receiver, regarding, content }).then(notification => {
        for (const user of getUserSocket(notification.receiver._id.toString())) {
            global.io.to(user.socketId).emit('notification', notification);
        };
    });
};

const notificationContent = (type, contentData = {}) => {
    switch (type) {
        case 'likedPost':
            return `${contentData.initiator} Liked Your Post.`;
        case 'userFollowing' :
            return `${contentData.followerName} is following you now.`
        default:
            return '';
    }
};