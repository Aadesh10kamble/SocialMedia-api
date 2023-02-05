import { Server } from "socket.io";
export let users = [];

export const socketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
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
const addUser = socket => socket.on('join', ({ userId }) => {
    users.push({ socketId: socket.id, userId });
});

const removeUser = socket => socket.on('exit', ({ userId }) => {
    users = users.filter(user => user.userId !== userId);
});




