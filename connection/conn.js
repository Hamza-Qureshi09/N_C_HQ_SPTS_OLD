const mongoose=require("mongoose");

mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log(`Connectin to DB is Successfull`);
}).catch((err)=>{console.log(err);}) 