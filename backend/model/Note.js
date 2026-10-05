import mongoose from "mongoose";

const noteSchema= new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    content:{
        type:String,
        default:""
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    pinned: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }, // true = trash e ache
    deletedAt: { type: Date, default: null },
}, {timestamps:true})


noteSchema.index({ user: 1, deleted: 1, pinned: -1, updatedAt: -1 });

noteSchema.index({ title: "text", content: "text" });


noteSchema.index({ deleted: 1, deletedAt: 1 });
export default mongoose.model("Note", noteSchema)