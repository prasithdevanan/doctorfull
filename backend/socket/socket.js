import NotificationModel from "../models/notificationModel.js";
import appointmentModel from "../models/appoimentModel.js";

const users = {};

export const initiSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);

        // register
        socket.on('register', async ({ userId, role }) => {
            users[userId] = { socketId: socket.id, role };

            // send to all users
            socket.emit('check', { users });
            console.log(`${role} registered with id: ${userId}`);

            // check for notifications IS doctor
            if (role === "Doctor") {
                const pendingAppointments = await NotificationModel.find({ doctorId: userId, isRead: false });

                if (pendingAppointments.length > 0) {
                    socket.emit('pending_notifications', pendingAppointments);
                };

                await NotificationModel.updateMany(
                    { userId, delivered: false },
                    { $set: { delivered: true } }
                );
            };

            if (role === "Patient") {

                /// find pending notifications
                const pendingNotification = await NotificationModel.find({ userId: userId, userRead: false, delivered: true, isRead: true });

                // find the last 10 notification as well
                const lastNotifications = await NotificationModel.find({ userId: userId, userRead: true }).sort({ createdAt: -1 }).limit(10);

                const formattedNotifications = pendingNotification.map((item) => ({
                    details: item,
                    notificationId: item._id,
                    status: item.status,
                    message: item.message
                }));


                const formattedLastNotifications = lastNotifications.map((item) => ({
                    details: item,
                    notificationId: item._id,
                    status: item.status,
                    message: item.message
                }));
                socket.emit('pending_notifications', { pending: formattedNotifications, last10: formattedLastNotifications });
            };



        });

        // patient book appotiments
        socket.on('book_appointment', async ({ patientId, doctorId, details }) => {

            const doctor = users[doctorId];

            //save the notification
            const notification = await NotificationModel.create({
                userId: patientId,
                doctorId: doctorId,
                userType: users[patientId].role,
                message: "New Appointment Booked",
                data: details,
            });

            if (doctor) {
                io.to(doctor.socketId).emit('new_appointment', notification);

                await NotificationModel.updateOne(
                    { _id: notification._id },
                    { $set: { delivered: true } }
                )
            }
        });

        // accect appointment
        socket.on('accept_appointment', async ({ doctorId, patientId, notificationId, details }) => {
            const doctor = users[doctorId];
            const patient = users[patientId];

            if (patient && doctor) {
                io.to(patient.socketId).emit("appointment_status", {
                    details,
                    notificationId,
                    status: "Accepted",
                    message: "Appointment accepted by doctor"
                });
            }

            await NotificationModel.updateOne(
                { _id: notificationId },
                { $set: { isRead: true, delivered: true, status: "Accepted" } })

            await appointmentModel.updateOne(
                { doctorId, appointmentDate: details.data.appointmentDate, appointmentTime: details.data.appointmentTime },
                { $set: { status: "Accepted" } }
            )
        });

        // reject appointment
        socket.on("reject_appointment", async ({ doctorId, patientId, notificationId, details }) => {
            const doctor = users[doctorId];
            const patient = users[patientId];

            if (patient && doctor) {
                io.to(patient.socketId).emit("appointment_status", {
                    details,
                    notificationId,
                    status: "Rejected",
                    message: "Appointment rejected by doctor"
                });
            }
            await NotificationModel.updateOne(
                { _id: notificationId },
                { $set: { isRead: true, delivered: true, status: "Rejected" } }
            );

            await appointmentModel.updateOne(
                { doctorId, appointmentDate: details.data.appointmentDate, appointmentTime: details.data.appointmentTime },
                { $set: { status: "Rejected", appointmentTime: null, appointmentDate: null } }
            )

        });

        //user see the message
        socket.on("user_seen", async ({ notificationId }) => {

            if (Array.isArray(notificationId)) {
                await NotificationModel.updateMany(
                    { _id: { $in: notificationId } },
                    { $set: { userRead: true } }
                );
            }

        });

        socket.on("disconnect", () => {
            console.log("a user disconnected", socket.id);

            //remove the users

            for (let userId in users) {
                if (users[userId]?.socketId === socket.id) {
                    delete users[userId];
                }
            }
        })
    })
}