import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true
    },
    assoiciate:{
        type: String,
        required: true,
        default: "",
    }
},
{
    timestamps: true
}
)

export default mongoose.model("Session", sessionSchema) //this will make admins