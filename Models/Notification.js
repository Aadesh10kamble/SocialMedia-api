import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    regarding: { type: Schema.Types.ObjectId },// Post for now
    content: { type: String, required: true },
    isTouched: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() }
});

const Notification = model('Notification', notificationSchema);
export default Notification;