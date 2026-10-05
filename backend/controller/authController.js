import jwt from "jsonwebtoken"
import User from "../model/User.js"
export const googleCallback=(req, res)=>{
    const user= req.user;
    const token= jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:7*24*60*60*1000
    })

    res.redirect(process.env.FRONTEND_URL)

}

export const me=async(req, res)=>{
    const user= await User.findById(req.userId);
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    res.status(200).json({user});

}

export const logout= (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message:"logout"})
}
