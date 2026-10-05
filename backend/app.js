import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import passport from "passport"
import "dotenv/config"
import cookieParser from "cookie-parser"
import authrouter from "./routes/authRoute.js"
import noterouter from "./routes/noteRoute.js"
import statsrouter from "./routes/statsRoute.js"
import "./controller/strategy/googleStrategy.js"
import helmet from "helmet";
import rateLimit from "express-rate-limit"
const app= express();

mongoose.connect(process.env.DATABASE_URL).then(()=>console.log("mongodb connected")).catch((e)=>console.log(e))
app.use(helmet())
app.use(cors({origin:process.env.FRONTEND_URL, credentials:true}))
app.use("/api", rateLimit({windowMs:15*60*1000, limit:300, standardHeaders:true, legacyHeaders:false}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize())

app.use("/api/auth", authrouter);
app.use("/api/notes", noterouter);
app.use("/api/stats", statsrouter);
app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).json({error:err.message})
})
app.listen(process.env.PORT,()=>console.log(`server is running on port ${process.env.PORT}`))