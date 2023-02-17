import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
    comment: { type: String, require: true },
    createAt: { type: Date, default: new Date() }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }

    });

commentSchema.pre(/^find/, function (next) {
    this.populate('user');
    next(null);
});

const Comment = model('Comment', commentSchema);
export default Comment;