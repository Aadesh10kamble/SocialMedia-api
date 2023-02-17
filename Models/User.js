import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const customValidator = [passwordMatch, "Password won't match"];
function passwordMatch(passwordConfirm) {
    return this.password === passwordConfirm;
};

const userSchema = new Schema([{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, validate: validator.isEmail },
    profilePic: { type: String, default: 'default.jpg' },
    password: { type: String, required: true, minlength: [8, "minimum 8 char required"] },
    isOnline: { type: Boolean, default: false },
    lastOnlineAt: { type: Date },

    passwordConfirm: { type: String, required: true, validate: customValidator },
    follower: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    passwordResetToken: { type: String },
    likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Tour' }]
}]);

userSchema.index({ email: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next(null);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordConfirm = undefined;
    next(null);
});

userSchema.methods.removeFromLiked = function (index, tour) {
    this.likedPosts.splice(index, 1);
    tour.likes = tour.likes - 1;
};

userSchema.methods.addToLiked = function (_, tour) {
    this.likedPosts.push(tour._id.toString());
    tour.likes = tour.likes + 1;
};

const User = model('User', userSchema);
export default User;