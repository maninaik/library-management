var BookModel = require('../models/book');
var AuthorModel = require('../models/author')
var BookInstanceModel = require('../models/bookinstance')
var GenreModel = require('../models/genre')
var async = require('async');
var {body, validationResult} = require('express-validator');

// for showing a dashboard of count of all documents in each model
exports.index = function(req, res) {
    async.parallel({
        book_count : function(cb){
            BookModel.countDocuments({}, cb)
        },   
        book_instance_count : function(cb){
            BookInstanceModel.countDocuments({}, cb);
        },
        book_instance_available_count : function(cb){
            BookInstanceModel.countDocuments({status : 'Available'}, cb);
        },
        author_count : function(cb){
            AuthorModel.countDocuments({}, cb);
        },
        genre_count : function(cb){
            GenreModel.countDocuments({}, cb);
        }
    },
        function(err, results){
            res.render('index',{error: err, data: results});
        }
    )
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    BookModel.find({}, 'title author')
        .populate('author')
        .exec((err, results) => {
            if(err) {return next(err);}
            res.render('book_list', {title: 'Book List', book_list : results});
        });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {

    async.parallel({
            book : function (cb){
                BookModel.findById(req.params.id)
                .populate('genre')
                .populate('author')
                .exec(cb);
            },
            book_instance : function (cb) {
                BookInstanceModel.find({ book : req.params.id })
                .exec(cb);
            }
        },
        function (err, results){
            if(err) { return next(err); }
            if(results.book == null){
                var er = new Error('No Book Found');
                er.status(404);
                return next(er);
            }
            res.render('book_detail', { title : results.book.title, book : results.book, book_instance : results.book_instance });
        }
    );
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
    async.parallel({
            genres : function (cb) {
                GenreModel.find(cb);
            },
            authors : function (cb) {
                AuthorModel.find(cb);
            }
        },
        function (err, results) {
            if(err) { return next(err); }
            res.render('book_form', {title : 'Create Book', genres : results.genres, authors : results.authors });
        }
    );
};

// Handle book create on POST.
exports.book_create_post = [
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre === 'undefined'){
                req.body.genre =[];
            }
            else{
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },

    body('title', 'Title must not be empty').trim().isLength({min:1}).escape(),
    body('author', 'Author must not be empty').trim().isLength({min:1}).escape(),
    body('summary', 'Summary must not be empty').trim().isLength({min:1}).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({min:1}).escape(),
    body('genre.*').escape(),


    (req, res , next) => {

        const errors = validationResult(req);
        var book = new BookModel({
            title : req.body.title,
            author : req.body.author,
            summary: req.body.summary,
            isbn : req.body.isbn,
            genre : req.body.genre 
        });

        if(!errors.isEmpty()){
            async.parallel({
                genres : function (cb) {
                    GenreModel.find(cb);
                },
                authors : function (cb) {
                    AuthorModel.find(cb);
                }
            },
            function (err, results) {
                if(err) { return next(err); }

                for (var i = 0; i < results.genres.length; i++){
                    if(book.genre.indexOf(results.genres[i]._id) > -1){
                        results.genres[i].checked = true;
                    }
                }
                res.render('book_form', {title : 'Create Book', genres : results.genres, authors : results.authors, book : book, errors : errors.array() });
            }
        );
        }
        else {
            // if no errors 
            book.save( (err) =>{
                if (err) { return next(err);}
                res.redirect(book.url);
            });
        }
        
    }

];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};

module.exports = exports;