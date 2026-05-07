import NotificationModel from "../models/notificationModel.js";

const users = {};

export const initiSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);

        // register
        socket.on('register', async ({ userId, role }) => {
            users[userId] = {
                socketId: socket.id,
                role
            }

            socket.emit('check', { users });
            console.log(`${role} registered with id: ${userId}`);

            if (role === "Doctor") {
                console.log("doctor connected");
                const pendingAppointments = await NotificationModel.find({ userId: userId, isRead: false });

                if (pendingAppointments.length > 0) {
                    socket.emit('pending_notifications', pendingAppointments);
                }

                await NotificationModel.updateMany(
                    { userId, delivered: false },
                    { $set: { delivered: true } }
                );
            }

        });

        // patient book appotiments
        socket.on('book_appointment', async ({ patientId, doctorId, details }) => {
            console.log("patient book appotiments", patientId, doctorId, details);

            const doctor = users[doctorId];

            //save the notification
            const notification = await NotificationModel.create({
                userId: doctorId,
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
        socket.on('accect_appointement', ({ doctorId, patientId, appointementId }) => {
            const patient = users[patientId];

            if (patient) {
                io.to(patient.socketId).emit("appointment_status", {
                    appointementId,
                    status: "accepted",
                    message: "Appointment accepted by doctor"
                });
            }
        });

        // reject appointment
        socket.on("reject_appointment", ({ doctorId, patientId, appointementId }) => {
            const patient = users[patientId];

            if (patient) {
                io.to(patient.socketId).emit("appointment_status", {
                    appointementId,
                    status: "rejected",
                    message: "Appointment rejected by doctor"
                });
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