var AuthorModel = require('../models/author');
var BookModel = require('../models/book');
var async = require('async');
var {body , validationResult} = require('express-validator');

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
    res.render('author_form', {title : 'Create Author'})
}

// to handle post on author create
exports.author_create_post = [
    body('first_name').trim().isLength({min:1}).escape().withMessage('First Name must be specified.')
    .isAlphanumeric().withMessage('First name should only contain alpha-numeric characters.'),
    body('family_name').trim().isLength({min:1}).escape().withMessage('Last Name must be specified.')
    .isAlphanumeric().withMessage('Last name should only contain alpha-numeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy : true}).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy : true}).isISO8601().toDate()
    ,
    (req, res, next) => {
        
        const errors = validationResult(req);

        var author = AuthorModel({
            first_name : req.body.first_name,
            family_name : req.body.family_name,
            date_of_birth : req.body.date_of_birth,
            date_of_death : req.body.date_of_death,
        });

        //check for any errors
        if(!errors.isEmpty()){
            res.render('author_form', {title : 'Create Author', author, errors : errors.array()});
        }
        else{

            author.save( (err) => {
                if(err) { return next(err); }
                res.redirect(author.url);
            });
        }
    }
];

//to handle get on author delete form
exports.author_delete_get = (req, res, next) => {
    async.parallel( {
            author : function (cb) {
                AuthorModel.findById(req.params.id).exec(cb);
            },
            books : function(cb) {
                BookModel.find( { 'author' : req.params.id }).exec(cb);
                
            }
        },  
        function(err, results) {
            if (err) { return next(err); }
            if(results.author == null) {
                res.redirect('/catalog/authors');
            }
            res.render('author_delete', {title : 'Delete Author', author : results.author , books : results.books });
        }
    );
}

//to handle post on author delete form
exports.author_delete_post = (req, res) => {
    async.parallel( {
            author : function (cb) {
                AuthorModel.findById(req.params.id).exec(cb);
            },
            books : function(cb) {
                BookModel.find( { 'author' : req.params.id }).exec(cb);
                
            }
        },  
        function(err, results) {
            if (err) { return next(err); }
            if(results.author == null) {
                res.redirect('/catalog/authors');
            }
            
            if(results.books.length > 0){
                res.render('author_delete', {title : 'Delete Author', author : results.author , books : results.books });
            }
            else {
                AuthorModel.findByIdAndDelete(req.body.authorid, (err) => {
                    if (err) { return next(err); }
                    res.redirect('/catalog/authors');
                });
            }
        }
    );

}

// to handle get on author update
exports.author_update_get = (req, res) => {
    AuthorModel.findById(req.params.id, (err, author) => {
        if (err) { return next(err); }
        res.render('author_form', {title : 'Update Author', author});
    });
}

// to handle post on author update form
exports.author_update_post = [
    body('first_name').trim().isLength({min:1}).escape().withMessage('First Name must be specified.')
    .isAlphanumeric().withMessage('First name should only contain alpha-numeric characters.'),
    body('family_name').trim().isLength({min:1}).escape().withMessage('Last Name must be specified.')
    .isAlphanumeric().withMessage('Last name should only contain alpha-numeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy : true}).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy : true}).isISO8601().toDate()
    ,
    (req, res, next) => {
        
        const errors = validationResult(req);

        var author = AuthorModel({
            first_name : req.body.first_name,
            family_name : req.body.family_name,
            date_of_birth : req.body.date_of_birth,
            date_of_death : req.body.date_of_death,
            _id : req.params.id
        });

        //check for any errors
        if(!errors.isEmpty()){
            res.render('author_form', {title : 'Update Author', author, errors : errors.array()});
        }
        else{
            AuthorModel.findByIdAndUpdate(req.params.id, author, (err) => {
                if(err){ return next(err); }

                res.redirect(author.url);
            });
        }
    }
];

