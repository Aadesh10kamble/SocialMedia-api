import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './Routes/user.js';
import tourRouter from './Routes/tour.js';
import commentRouter from './Routes/comment.js';
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { socketServer } from './socketConfiguration.js';
import { getNotification } from './apis/notification.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use('/', (req, res, next) => {
    res.success = (message) => res.status(200).json({ isSuccess: true, message });
    res.failure = (message) => res.status(202).json({ isSuccess: false, message });
    next(null);
})
app.use('/imageCover', express.static(`${__dirname}/public/media/imageCover`));
app.use('/images', express.static(`${__dirname}/public/media/images`));
app.use('/profilePic', express.static(`${__dirname}/public/media/profilePic`));

app.get (`/notification/:userId`,getNotification);
app.use('/user', userRouter);
app.use('/tour', tourRouter);
app.use('/comment', commentRouter);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_LOCAL)
    .then(() => {
        const server = app.listen(process.env.PORT, connect => console.log("Server line"));
        socketServer (server);
    });