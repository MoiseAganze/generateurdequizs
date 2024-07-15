require("dotenv").config()
const mongoose=require("mongoose")

async function connectdb() {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connexion ok");
}

module.exports={
    connectdb
}