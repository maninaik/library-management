var BookModel = require('../models/book');
const genre = require('../models/genre');
var GenreModel = require('../models/genre');
var async = require('async');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {

    GenreModel.find()
    .sort([['name', 'ascending']])
    .exec((err, results) => {
        if (err) { return next(err); }
        // if success..
        res.render('genre_list', {title : 'Genre List', genre_list : results });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre : function(cb) {
            GenreModel.findById(req.params.id)
            .exec(cb);
        },
        genre_books : function(cb) {
            BookModel.find({ genre : req.params.id })
            .exec(cb);
        }
    },
        function(err, results){
            if(err) return next(err);
            if(results.genre == null){
                var er = new Error('Genre not found');
                er.status(404);
                return next(er);
            }
            res.render('genre_detail', {title : 'Genre Detail', genre : results.genre, genre_books : results.genre_books})
        }
    );
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};