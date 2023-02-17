import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './Models/User.js';
import errorHandler from './errorHandling.js';
import sharp from "sharp";
import { createNotification } from './notificationhelper.js';

export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    try {
        const user = await User.create({
            firstName, lastName, email,
            password: password,
            passwordConfirm: confirmPassword
        });

        res.status(201).json({
            isSuccess: true,
            message: 'Account created',
            data: { user }
        });
    } catch (error) {
        res.status(200).json({ isSuccess: false, error: errorHandler(error) });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) throw new Error('Incorrect Email Or Password');
        user.password = undefined;
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ isSuccess: true, message: 'Successfully Logged In', data: { user, token } });
    } catch (error) {
        res.status(200).json({ isSuccess: false, error: error.message });
    }
};

export const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.cookie.jwt;
    try {
        console.log (token);
        if (!token) throw new Error('token not found');
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(userId);
        if (!user) throw new Error("user doesn't exist");
        req.user = user;
        next(null);
    } catch (error) {
        console.log(error.message);
    }
};

//When you are logged in and wants to update the password.
export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword, newConfirmPassword } = req.body;
    const { user } = req;
    try {
        if (!currentPassword) throw new Error('Provide current password');
        if (!await bcrypt.compare(currentPassword, user.password)) {
            return res.failure('wrong current password');
        };
        user.password = newPassword;
        user.passwordConfirm = newConfirmPassword;
        await user.save({ validateModifiedOnly: true });
        res.status(200).json({ isSuccess: true, message: 'password updated' });
    } catch (error) {
        res.status(400).json({ isSuccess: false, error: error.message });
    }
};

// Everything except password.
export const updateProfile = async (req, res) => {
    const { user } = req;
    const { firstName, lastName, email } = req.body;
    try {
        console.log ("Name......");
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        console.log (req.files.profilePic);
        if (req.files?.profilePic) {
            console.log (req.files.profilePic.at (0));
            const file = req.files.profilePic.at(0);
            const fileName = `${user._id}-profilePic-${file.originalname}`;
            sharp(file.buffer).resize(500, 500)
                .toFile(`${process.cwd()}/public/media/profilePic/${fileName}`);
            user.profilePic = fileName;
        };
        await user.save({ validateModifiedOnly: true });
        res.status(200).json({ isSuccess: true, data: user });
    } catch (error) {
        res.status(200).json({ isSuccess: false, error: error.message });
    }
};

export const followUser = async (req, res) => {
    const { userId } = req.params;
    const { user } = req;
    try {
        let isNotificationRequired = false;
        const userToFollow = await User.findById(userId);
        if (!userToFollow) throw new Error('user not found');

        const followingIndex = user.following.findIndex(follow => (follow._id || follow.id) === userToFollow._id || userToFollow.id);
        const followerIndex = userToFollow.follower.findIndex(follow => (follow._id || follow.id) === user._id || user.id);
        
        if (followingIndex < 0 && followerIndex < 0) {
            isNotificationRequired = true;
            user.following.push(userToFollow._id || userToFollow.id);
            userToFollow.follower.push(user._id || user.id);
        } else {
            user.following.splice(followingIndex, 1);
            userToFollow.follower.splice(followerIndex, 1);
        };

        await user.save({ validateModifiedOnly: true });
        await userToFollow.save({ validateModifiedOnly: true });

        if (isNotificationRequired) {
            createNotification('userFollowing', userToFollow, user, { followerName: user.firstName });
        };
        res.status(200).json({ isSuccess: true, data: { userId, followerList: userToFollow.follower } });
    } catch (error) {
        console.log(error);
        res.failure(error);
    }
};


export const getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('user not found.');
        res.status(200).json({ isSuccess: true, data: user });
    } catch (error) {
        res.failure(error.message);
    }
};