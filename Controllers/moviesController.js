const { parse } = require("dotenv");
const Movie=require("./../models/movieModel");
const ApiFeatures=require('./../utils/ApiFeatures')
const asyncErrorHandler=require('./../utils/asyncErrorHandler');
const CustomError = require("../utils/customError");
exports.getHighestRated=(req,res,next)=>{
    req.query.limit='5';
    req.query.sort='-ratings'

    next();
}
// exports.validateBody=(req,res,next)=>{
//     if(!req.body.name || !req.body.releaseYear){
//         return res.status(400).json({
//             status:'fail',
//             message:'Not a valid middleware'
//         })
//     }
//     next();
// }
//Route handler functions
exports.getAllMovies=asyncErrorHandler(async(req,res,next)=>{
        const features=new ApiFeatures(Movie.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

        let movies=await features.query;

      /* Mongoose 6.0 or less
       const excludeFields=['sort','page','fields'];
       const queryObj={...req.query}; //shallow copy
       console.log(queryObj);
       excludeFields.forEach((el)=>{
          delete queryObj[el]
       })
       Mongoose 7.0*/
       res.status(200).json({
        status:'success',
        length:movies.length,
        data:{
            movies
        }
     })
    })

exports.getSingleMovieByID=asyncErrorHandler(async (req,res,next)=>{
    //const movie=await Movie.find({_id:req.params.id})
    const movie=await Movie.findById(req.params.id);
   // console.log(x); //this will be handled inside express that are handled by globalErrorHandler
    if(!movie){
        const err=new CustomError("Movie with the error not found",404)
        return next(err);
      }
    res.status(200).json({
        status:'success',
        data:{
            movie
        }
     });  
})

// const asyncErrorHandler=(func)=>{
//     return (req,res,next)=>{
//         func(req,res,next).catch(err=>next(err)); //this anonymous func will be called by express
//     }
// }//this should not be called immediately when post req is made only then it should be called

//it is not function now 
exports.createMovie=asyncErrorHandler(
    async (req,res,next)=>{
        //    const testMovie=new Movie({});
        //    testMovie.save();
              const movie=await Movie.create(req.body);
              res.status(201).json({
                 status:'success',
                 data:{
                   //movie:movie
                    movie
                }
      })
 });


exports.updateMovie=asyncErrorHandler(async (req,res,next)=>{
        const updatedMovie=await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).json({
            status:'success',
            data:{
                movie:updatedMovie
            }
        })
})

exports.deleteMovie=asyncErrorHandler(async(req,res,next)=>{
     await Movie.findByIdAndDelete(req.params.id);
     res.status(204).json({
        status:'success',
        data:null
    })
   })

exports.getMovieStats=asyncErrorHandler(async(req,res,next)=>{
        const stats=await Movie.aggregate([
            {$match:{releaseDate:{$lte:new Date()}}},
            {$match:{ratings:{$gte:4.5}}},
            {$group:{
                _id:'$releaseYear',
                averageRating:{$avg:'$ratings'},
                averagePrice:{$avg:'$price'},
                minPrice:{$min:'$price'},
                maxPrice:{$max:'$price'},
                totalPrice:{$sum:'$price'},
                movieCount:{$sum:1}
            }},
            {$sort:{minPrice:1}},
           // {$match:{maxPrice:{$gte:60}}}
        ]);
        res.status(200).json({
            status:'success',
            count:stats.length,
            data:{
                stats
            }
        })
})

exports.getMovieByGenre=asyncErrorHandler(async(req,res,next)=>{
     const genre=req.params.genre;
     const movies=await Movie.aggregate([
        {$match:{releaseDate:{$lte:new Date()}}},  {$sort:{movieCount:-1}},
        {$unwind:'$genres'},
        {$group:{
            _id:'$genres',
            movieCount:{$sum:1},
            movies:{$push:'$name'},
        }},
        {$addFields:{genre:"$_id"}},
        {$project:{_id:0}},
        {$sort:{movieCount:-1}},
        //{$limit:6}
        {$match:{genre:genre}}
     ]);
 
    res.status(200).json({
        status:'success',
        count:movies.length,
        data:{
            movies
        }
    })
  })
