//script file independent of express app
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const fs=require('fs')

const Movie=require('./../models/movieModel');
//const { deleteMovie } = require('../Controllers/moviesController');

dotenv.config({path:'./config.env'});
//connect to mongodb
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((conn)=>{
   //console.log(conn);
   console.log("DB Connection successful")
}).catch((err)=>{
    console.log(err,"Some Error Occurred");
})

const movies=JSON.parse(fs.readFileSync('./data/movies.json','utf-8'))

//delete existing movie documents from collection
const deleteMovies=async()=>{
  try{
      await Movie.deleteMany();
      console.log("Data successfully deleted")
  }catch(err){
    console.log(err.message)
  }
  process.exit();
}

//import movies data from data to mongo db collection
const importMovies=async()=>{
   try{
       await Movie.create(movies);
       console.log('data successfully imported')
   }catch(err){
      console.log(err.message)
   }
   process.exit();
}

//console.log(process.argv)
if(process.argv[2]==='--import'){
    importMovies();
}
if(process.argv[2]==='--delete'){
   deleteMovies();
}