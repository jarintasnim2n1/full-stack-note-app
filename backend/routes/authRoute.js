import express from "express";
import {googleCallback,  logout, me} from "../controller/authController.js"
import  auth from "../middleware/authMiddleware.js"
import passport from "passport"
const router= express.Router();

router.get("/google", passport.authenticate("google",{scope:["profile", "email"], session:false}));

router.get("/google/callback", passport.authenticate("google",{session:false, 
    failureRedirect:`${process.env.FRONTEND_URL}/sign-in?error=oauth_failed`
}),
googleCallback
)

router.get("/me",auth, me);
router.post("/logout", logout);

export default router