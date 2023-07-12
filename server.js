const dotenv=require('dotenv');

dotenv.config({path:'./config.env'});
const mongoose=require('mongoose');

process.on('uncaughtException',(err)=>{
    console.log(err.name , err.message) 
    console.log('Unhandled exception occurred! Shutting down')
      process.exit(1); //1 for uncaught exception
})

const app=require('./app');

//console.log(app.get('env'));
console.log(process.env);
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((conn)=>{
   //console.log(conn);
   console.log("DB Connection successful")
}).catch((err)=>{
    console.log(err," Error Occurred");
})

// const testMovie=new Movie({
//     name:"Interstellar",
//     description:"Action packed movie interstellar",
//     duration:149,
//     ratings:4.0
// });

// testMovie.save().then((doc)=>{
//   console.log(doc)
// }).catch((err)=>{
//     console.log(err," Error occurred")
// });

const port=process.env.PORT || 3000;
const server=app.listen(port,()=>{
    console.log("Server started...")
})

process.on('unhandledRejection',(err)=>{
  console.log(err.name , err.message) 
  console.log('Unhandled exception occurred! Shutting down')
 
  server.close(()=>{
    process.exit(1);
  }); //1 for uncaught exception
})
//running synchronously occurred in sync code uncaught exception