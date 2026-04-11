import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    image: {type:String},
    gender: {type:String, default:"Not Selectes"},
    DOB: {type:String, default:"Not Selectes"},
    phone: {type:String, default:"00000000000"},
})


const userModel = mongoose.models.user || mongoose.model('user', userSchema);