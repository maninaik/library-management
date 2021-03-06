var BookModel = require('../models/book');
var GenreModel = require('../models/genre');
var async = require('async');
var { body, validationResult } = require('express-validator')

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
exports.genre_create_get = function ( req, res, next) {
    res.render('genre_form', {title : 'Create Genre'});
};


// Handle Genre create on POST.
exports.genre_create_post = [
    body('name', 'Genre name required').trim().isLength({min : 1}).escape()
    ,
    function(req, res, next) {
        const errors = validationResult(req);

        var genre = new GenreModel({
            name : req.body.name
        });

        if(!errors.isEmpty()){
            res.render('genre_form', {title : 'Create Genre', genre, errors : errors.array() });
        }
        else{
            GenreModel.findOne({name : req.body.name})
            .exec( (err, name_found) => {
                    if (err) { return next(err); }
                    
                    if(name_found){
                        // an error that name already exists
                        // redirect to the genre detail page
                        res.redirect(name_found.url);
                    }
                    else {
                        genre.save( (err) => {
                            return next(err);
                        });
                        res.redirect(genre.url);
                    }     
            });
            
        }
        
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    async.parallel( {
        genre : function (cb) {
            GenreModel.findById(req.params.id).exec(cb);
        },
        books : function(cb) {
            BookModel.find( { 'genre' : req.params.id }).exec(cb);
            
        }
    },  
    function(err, results) {
        if (err) { return next(err); }
        if(results.genre == null) {
            res.redirect('/catalog/genres');
        }
        res.render('genre_delete', {title : 'Delete Genre', genre : results.genre , books : results.books });
    }
);
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    async.parallel( {
            genre : function (cb) {
                GenreModel.findById(req.params.id).exec(cb);
            },
            books : function(cb) {
                BookModel.find( { 'genre' : req.params.id }).exec(cb);
            }
        },  
        function(err, results) {
            if (err) { return next(err); }
            if(results.genre == null) {
                res.redirect('/catalog/genres');
            }
            
            if(results.books.length > 0){
                res.render('genre_delete', {title : 'Delete Genre', genre : results.genre , books : results.books });
            }
            else {
                GenreModel.findByIdAndDelete(req.body.genreid, (err) => {
                    if (err) { return next(err); }
                    res.redirect('/catalog/genres');
                });
            }
        }
    );
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
    GenreModel.findById( req.params.id, (err, genre) => {
        res.render('genre_form', {title :'Update Genre', genre});
    })
};

// Handle Genre update on POST.
exports.genre_update_post = [
    body('name', 'Genre name required').trim().isLength({min : 1}).escape()
    ,
    function(req, res, next) {
        const errors = validationResult(req);

        var genre = new GenreModel({
            name : req.body.name,
            _id : req.params.id 
        });

        if(!errors.isEmpty()){
            res.render('genre_form', {title : 'Update Genre', genre, errors : errors.array() });
        }
        else{
           GenreModel.findByIdAndUpdate(req.params.id, genre, (err) => {
                if (err) {return next(err); }
                
                res.redirect(genre.url);
           });
        }
    }
];