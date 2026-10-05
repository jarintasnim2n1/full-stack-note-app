import mongoose, { model } from "mongoose";

 const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    profilePicture:{
        type:String,
       default:""
    },
    googleId: 
    { type: String, 
        required: true, 
        unique: true 
    },
    provider:{
        type:String,
        default:"google"
    }
}, {timestamps:true})

export default mongoose.model("User", userSchema)
