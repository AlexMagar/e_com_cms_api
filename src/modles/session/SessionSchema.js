import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    toekn:{
        type: String,
        required: true
    },
    assoiciate:{
        type: String,
        required: true,
    }
},
{
    timestamps: true
}
)

export default mongoose.model("Session", sessionSchema) //this will make admins