import mongoose from "mongoose";
import appointmentModel from "../models/appoimentModel.js";
import NotificationModel from "../models/notificationModel.js";

const connetDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Mongoose is connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/medix`);

    // await NotificationModel.deleteMany({"doctorId":"69d8969ea6048c81e273d166"});
    await appointmentModel.syncIndexes();
    await NotificationModel.syncIndexes();
    // const indexes = await appointmentModel.collection.indexes();
    // console.log(indexes);
};

export default connetDB;