import { Server } from "socket.io";
import User from "./Models/User.js";
export let users = [];

export const socketServer = server => {
    const origin = process.env.NODE_ENV === 'production' ?
        process.env.REACT_APP_LIVE :
        process.env.REACT_APP_LOCAL;

    const cors = { methods: ['GET', 'POST'], origin };
    const io = new Server(server, { cors });
    io.on('connect', socket => {
        console.log('user connected');
        global.io = io;
        addUser(socket);
        removeUser(socket);
    });

    io.on('disconnect', socket => {
        const socketIndex = users.findIndex(user => user.socketId === socket.id);
        if (socketIndex >= 0) users.splice(socketIndex, 1);
    });
};

export const getUserSocket = userId => users.filter(user => user.userId === userId);
const addUser = socket => socket.on('join', async ({ userId }) => {
    await User.findByIdAndUpdate(userId, { isOnline: true });
    users.push({ socketId: socket.id, userId });
});

const removeUser = socket => socket.on('exit', async ({ userId }) => {
    await User.findByIdAndUpdate(userId, { isOnline: false, lastOnlineAt: new Date() });
    users = users.filter(user => user.userId !== userId);
});




