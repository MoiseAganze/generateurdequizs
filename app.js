
const express=require('express')
const app=express()
const { connectdb } = require("./services/mongoose")
const session=require("express-session")
const cookieParser=require("cookie-parser")
const authentification=require("./middlewares/authentification")


connectdb().catch(err=>console.log(err))

app.use(cookieParser())
app.use(session({
  secret: 'qwerty',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 heures en millisecondes
}
}));


app.set('views', 'IHM')
app.set('view engine', 'ejs')
app.use (express.static (__dirname + '/IHM'));
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const connectRoutes=require("./routes/inscription")
app.use(connectRoutes)

const quizRoutes=require("./routes/quizs")
app.use(quizRoutes)

app.get("/compte",(req,res)=>{
    res.status(200).render("compte")
})

app.get('/error', (req, res) => res.status(503).render("erreur"));
app.post("/logout",authentification,(req,res)=>{
    req.session.destroy(function(err){
        if(err){
            res.redirect("/error")
        }else{
            res.redirect("/")
        }
    })
})
app.get("/",authentification,(req,res)=>{
    var usr=req.user
    var usrmongo=req.usermongo
    res.status(200).render("index",{user:usr,usermongo:usrmongo})
})

app.use((req,res,next)=>{

    res.status(404).render("erreur")
})
app.listen(3001)
console.log("attentes des requetes ");