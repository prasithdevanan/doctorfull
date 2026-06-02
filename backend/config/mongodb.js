import mongoose from "mongoose";
import appointmentModel from "../models/appoimentModel.js";

const connetDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Mongoose is connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/medix`);

    // await appointmentModel.deleteMany({"doctorId":"69d60a88d1479058b31a611e"});
    await appointmentModel.syncIndexes();
    // const indexes = await appointmentModel.collection.indexes();
    // console.log(indexes);
};

export default connetDB;