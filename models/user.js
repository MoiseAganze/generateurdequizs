const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(v){
            if(!validator.isEmail(v)){
                throw new Error("Email invalide")
            }
        }
    },
    quizs:[[]],
    // password:{
    //     type:String,
    //     required:true,
        
    // },
    authTokens:[{
        authToken:{
            type:String,
            required:true
        }
    }]
    
})


userSchema.methods.toJSON=function(){
    const user=this.toObject()

    delete user.password;
    delete user.authTokens

    return user
}

userSchema.methods.generateAuthTokenAndsaveuser=async function(){
    const authToken=jwt.sign({_id:this._id.toString()}, 'foo')
    this.authTokens.push({ authToken })
    await this.save()
    return authToken
}
userSchema.methods.addQuiz=async function(quiz){
    this.quizs.push(quiz)
    await this.save()
    return quiz
}

userSchema.methods.addQuizScore=async function(idquiz,gamer){
    try{ 
        var gamerexist=false
    for(var i=0;i< this.quizs.length;i++){
        if(this.quizs[i][0].id==idquiz){
            if(this.quizs[i][0].gamers.length>0){
                this.quizs[i][0].gamers.forEach(element => {
                    if(element.email==gamer.email){
                        gamerexist=true
                    }
                });
                if(!gamerexist){
                    this.quizs[i][0].gamers.push(gamer)
                    this.markModified('quizs');
                }
            }else{
                this.quizs[i][0].gamers.push(gamer)
                this.markModified('quizs');
                
            }
            i--
                break
        }
    }
}catch(err){
    console.log(err);
    
}

    await this.save()
    return gamer
}

userSchema.methods.removeQuiz=async function(idquiz){
    for(var i=0;i< this.quizs.length;i++){
        if(this.quizs[i][0].id==idquiz){
            this.quizs.splice(i,1)

            i--
 
        }
    }
    await this.save()
    return idquiz
}

userSchema.statics.findUser=async(email)=>{
    const user=await User.findOne({ email })
    if(!user) return undefined
    // const isPassValide= await bcrypt.compare(password,user.password)
    // if(!isPassValide) throw new Error("Impossible de se connecter")
    return user
}



// userSchema.pre('save',async function(){
//     if(this.isModified('password')) this.password=await bcrypt.hash(this.password,8)
// })

const User=mongoose.model("UserQuiz",userSchema)



module.exports=User