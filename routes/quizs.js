const express=require("express")
const router=express.Router()
const User=require("../models/user")
const authentification=require("../middlewares/authentification")

router.post("/voirquiz",authentification,async (req,res)=>{
    var tab=req.body.inputquiz
    const quiz=await req.usermongo.addQuiz(JSON.parse(tab))
    // res.status(200).render("voirquiz",{tab:tab})
    res.redirect("/")
})
router.get("/supprimerquiz/:id",authentification,async (req,res)=>{
    const id=req.params.id
    const user=req.usermongo
    await user.removeQuiz(id)
    res.redirect("/")
})
router.get("/quiz/:id",authentification,async (req,res)=>{
    const user=req.user
    var quiz=[]
    const quizid=req.params.id
    const idcreateurquiz=quizid.split("^")[0]
    const us=await User.findOne({_id:idcreateurquiz})
    
    for(var i=0;i<us.quizs.length;i++){
        if(us.quizs[i][0].id==quizid){
            if(us.quizs[i][0].gamers.length < us.quizs[i][0].maxjoueurs||user.email==us.email){
                quiz=us.quizs[i]
                const tab=JSON.stringify(quiz)
                res.render("myquizs",{tab:tab,user:user,id:quizid})
            }else{
                res.redirect("/sorry")
            }
            break
        }
    }
    
})


router.get("/creer",authentification,(req,res)=>{
const iduser=req.usermongo._id
  res.status(200).render("creequiz",{userid:iduser})
})
router.post("/setscore",authentification,async(req,res)=>{
    const score=req.body.score
    const time=req.body.time
    const name=req.body.name
    const email=req.body.email
    const id=req.body.quizid
    const idcreateurquiz=id.split("^")[0]
    const createurquiz=await User.findOne({_id:idcreateurquiz})
    if(req.usermongo.email!=createurquiz.email){
        const gamer={joueur:name,score:score,temps:time,email:email}
        await createurquiz.addQuizScore(id,gamer)
    }
    
    res.redirect("/")
})

router.get("/stats/:id",authentification,async(req,res)=>{
    const user=req.user
    var quiz=[]
    const quizid=req.params.id
    const idcreateurquiz=quizid.split("^")[0]
    const us=await User.findOne({_id:idcreateurquiz})
    
    for(var i=0;i<us.quizs.length;i++){
        if(us.quizs[i][0].id==quizid){
            quiz=us.quizs[i]
            break
        }
    }
    const tab=JSON.stringify(quiz)
    res.status(200).render("stats",{tab})
})
router.get("/sorry",(req,res)=>{
    res.render("quizfinish")
})
module.exports=router