import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema({
    fName:{
        type: String,
        required: true,
    },
    lName:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
})

export default mongoose.model("Cms_admin", cmsSchema) //this will make cms-admins