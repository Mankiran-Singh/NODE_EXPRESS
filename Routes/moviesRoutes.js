//returns middleware applying middleware to certain routes
const express=require('express');
const moviesController=require('./../Controllers/moviesController')
const router=express.Router();

// router.param('id',moviesController.checkId);
//middleware can be processed by next middleware also
router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getAllMovies)
router.route('/movie-stats').get(moviesController.getMovieStats)
router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre)
router.route('/')
    .get(moviesController.getAllMovies)
    .post(
        //moviesController.validateBody,
        moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getSingleMovieByID)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports=router;