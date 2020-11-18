var AuthorModel = require('../models/author');
var BookModel = require('../models/book');
var async = require('async');

// to retrieve all authors
exports.author_list = (req, res) => {
    AuthorModel.find()
    .sort([['family_name', 'ascending']])
    .exec( (err, results) => {
        res.render('author_list', {title: 'Author List', author_list: results});
    });
}

//to get details of a particular author
exports.author_detail = (req, res, next) => {
    async.parallel({
            author : function (cb){
                AuthorModel.findById(req.params.id)
                .exec(cb);
            },
            author_books : function (cb) {
                BookModel.find( { author : req.params.id } )
                .populate('author')
                .populate('genre')
                .exec(cb);
            }
        },
        function (err, results) {
            if (err) { return next(err) }

            res.render('author_detail', { title : results.author.name, author : results.author, author_books : results.author_books });
        }
    );
}

// to get author create form
exports.author_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED author create get')
}

// to handle post on author create
exports.author_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED author create post')
}

//to handle get on author delete form
exports.author_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED author delete get')
}

//to handle post on author delete form
exports.author_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED author delete post')
}

// to handle get on author update
exports.author_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED author update get')
}

// to handle post on author update form
exports.author_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED author update post')
}

