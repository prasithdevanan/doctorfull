import mongoose, {Schema} from "mongoose";

const LogoSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: true}
})

const logoModel = mongoose.models.logo || mongoose.model('logo', LogoSchema);

export default logoModel;