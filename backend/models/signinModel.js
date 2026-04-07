import mongoose from "mongoose";

const signinSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true}
})

const signinModel = mongoose.models.signin || mongoose.model('signin', signinSchema);

export default signinModel;