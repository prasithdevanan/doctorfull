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
            console.log(users);
            console.log(`${role} registered with id: ${userId}`);
            const notification = await NotificationModel.find({ userId, isRead: false }).sort({ createdAt: -1 });

            socket.emit('pending_notifications', notification);

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
            })

            if (doctor) {
                io.to(doctor.socketId).emit('new_appointment', { patientId, details, message: "New Appointment Booked" });

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