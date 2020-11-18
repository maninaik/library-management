var BookModel = require('../models/book');
var AuthorModel = require('../models/author')
var BookInstanceModel = require('../models/bookinstance')
var GenreModel = require('../models/genre')
var async = require('async');
const book = require('../models/book');

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
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

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