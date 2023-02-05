import { Schema, model } from "mongoose";

const tourSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    caption: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    images: [String],
    createdAt: { type: Date, default: new Date() }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }

    });

// By default virtual fields are not shown.
tourSchema.virtual('comments', {
    localField: '_id',
    foreignField: 'tour',
    ref: 'Comment'
});

const Tour = model('Tour', tourSchema);
export default Tour;