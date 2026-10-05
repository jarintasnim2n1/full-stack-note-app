import jwt from "jsonwebtoken";
import User from "../model/User.js"
 const protectOauth=async(req, res, next)=>{
 try {
    const token= req.cookies?.token;
    if(!token){
        return res.status(401).json({message:"token not found"})
    }
    const decoded= jwt.verify(token, process.env.JWT_SECRET);
    const user= await User.findById(decoded.id).select("-__V");
    if(!user){
        return res.status(401).json({message:"user not exist"})
    }
  req.userId = user._id;    
  req.user = user;          
  next();
 } catch (error) {
    next(error)
 }
}

export default protectOauth