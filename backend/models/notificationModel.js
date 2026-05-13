import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Appointment"
    },
    userType: {
        type: String,
        enum: ["Patient", "Doctor"],
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    },
    data: {
        type: Object
    },
    isRead: {
        type: Boolean,
        default: false
    },
    userRead: {
        type: Boolean,
        default: false
    },
    delivered: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NotificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default NotificationModel;