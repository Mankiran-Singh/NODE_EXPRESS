/*LECTURE 30 Intro NOde with Express*/
//import express
// const express=require('express');
// let app=express();

// //ROUTE = HTTP METHOD + URL
// //for html response
// // app.get('/',(req,res)=>{
// //    res.status(200).send('<h4>hello from http Server<h4>')
// // })
// //for json response
// app.get('/',(req,res)=>{
//     res.status(200).json({message:'Hello World', status:200})
//  })

// //Create a Server
// const port= 3000;
// app.listen(port,()=>{
//     console.log('Server has started.....')
// })

//const exp = require('constants');
const express=require('express');
//const fs=require('fs');
const morgan=require('morgan');

const moviesRouter=require('./Routes/moviesRoutes');

const CustomError = require('./utils/customError');

const globalErrorHandler=require('./Controllers/errorController')
let app=express();

app.use(express.json());//middle to modify the incoming data 
//called middleware because stands between req and res
//data to body is added to this request object
// if(process.env.NODE_ENV==='development'){
//    app.use(morgan('dev'));
// }   //applied on every request
//this morgan() returns us a function which acts as a middleware function
//we are calling morgan so that it will return us logger middleware function
//and that logger is used by express app

//Serving static files
app.use(express.static('./public'))
//custom middleware()
// app.use((req,res,next)=>{
//     req.requestedAt=new Date().toISOString();
//     next();
// })



//RESPONSE to REQUESTS
//GET - api/movies


// app.get('/api/v1/movies',getAllMovies)

// //Get - api/v1/movies/id - route parameter : specifies this id is route parameter
// app.get('/api/v1/movies/:id',getSingleMovieByID)

// //post request
// app.post('/api/v1/movies',createMovie)

// //Patch
// app.patch('/api/v1/movies/:id',updateMovie)

// //DELETE REQUEST 
// app.delete('/api/v1/movies/:id',deleteMovie)


app.use('/api/v1/movies',moviesRouter) //apply middleware to this url only
//mounting routes

app.all('*',(req,res,next)=>{
//    res.status(404).json({
//      status:'fail',
//      message:`can't find ${req.originalUrl} on the server!`
//    });

//    const err=new Error(`can't find ${req.originalUrl} on the server!`);
//    err.status='fail';
//    err.statusCode=404
    const err=new CustomError(`can't find ${req.originalUrl} on the server!`,404)

   next(err); //express will forget about other middlewares and put this middleware in middleware stack(global error handling) 
});

//global error handling middleware
app.use(globalErrorHandler)

//create a server
module.exports=app;

