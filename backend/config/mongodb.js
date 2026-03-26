import mongoose from "mongoose";

const connetDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Mongoose is connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI }/medix`);
};

export default connetDB;