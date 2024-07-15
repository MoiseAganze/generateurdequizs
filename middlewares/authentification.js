const jwt=require("jsonwebtoken")
const User=require("../models/user")

const authentification=async(req,res,next)=>{
    res.cookie("lienredirect",req.path,{maxAge:30000,httpOnly:true})
    try {
        
        const connect=req.session.connect
        const useremail=connect.email
        console.log(useremail);
        const user=await User.findOne({email:useremail})
        if(!user) throw new Error()
        // const decodedToken=jwt.verify(authToken,"foo")
        // const user=await User.findOne({ _id:decodedToken._id, 'authTokens.authToken':authToken})
        // if(!user) throw new Error()
        // req.authToken=authToken
        req.user=connect
        req.usermongo=user
        next()
    } catch (error) {
        // console.log(error);
        res.redirect("/compte")
        // res.status(401).send("Merci de vous authentifier,"+req.authToken)
    }
}

module.exports=authentification

