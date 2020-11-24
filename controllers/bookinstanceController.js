var BookInstanceModel = require('../models/bookinstance');
var BookModel = require('../models/book');
var {body, validationResult} = require('express-validator');
var async = require('async');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    BookInstanceModel.find()
        .populate('book')
        .exec( (err, results) => {
            if (err) { return next(err);}
            res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: results });
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    BookInstanceModel.findById(req.params.id)
    .populate('book')
    .exec( (err, results) => {
        if(err) { return next(err); }
        res.render('bookinstance_detail', {title : 'Copy : ' + results.book.title, bookinstance : results });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {

    BookModel.find( (err, books) => {
        if(err) { return next(err); }
        res.render('bookinstance_form', {title : 'Create Book Instance', books});
    });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body('book', 'Book must be specified').trim().isLength({min : 1}).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({min : 1}).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({checkFalsy : true}).isISO8601().toDate(),  

    (req, res, next) => {

        const errors = validationResult(req);
        var book_instance = new BookInstanceModel({
            book : req.body.book,
            imprint : req.body.imprint,
            status : req.body.status,
            due_back : req.body.due_back,
        });

        if(!(errors.isEmpty())){
            BookModel.find( (err, books) => {
                if(err) { return next(err); }
                res.render('bookinstance_form', { title : 'Create Book Instance', books : books, book_instance : book_instance, errors : errors.array() });
            });
            return;
        }
        else {
            book_instance.save( (err) => {
                if(err) { return next(err); }

                res.redirect(book_instance.url);
            })
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    BookInstanceModel.findByIdAndRemove(req.body.bookinstanceid, (err) => {
        if(err) { return next(err); }
        res.redirect('/catalog/bookinstances');
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
    async.parallel({
            books : function (cb) {
                BookModel.find(cb);
            },
            book_instance : function(cb) {
                BookInstanceModel.findById(req.params.id)
                .exec(cb);
            }
        },
        function(err, results) {
            if (err) { return next(err); }
            res.render('bookinstance_form', {title : 'Update Book Instance', books : results.books, book_instance : results.book_instance});
        }
    );
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
    body('book', 'Book must be specified').trim().isLength({min : 1}).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({min : 1}).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({checkFalsy : true}).isISO8601().toDate(),  

    (req, res, next) => {

        const errors = validationResult(req);
        var book_instance = new BookInstanceModel({
            book : req.body.book,
            imprint : req.body.imprint,
            status : req.body.status,
            due_back : 'undefined' === req.body.due_back ? '' : req.body.due_back,
            _id : req.params.id
        });

        if(!(errors.isEmpty())){
            BookModel.find( (err, books) => {
                if(err) { return next(err); }
                res.render('bookinstance_form', { title : 'Update Book Instance', books : books, book_instance : book_instance, errors : errors.array() });
            });
            return;
        }
        else {
            BookInstanceModel.findByIdAndUpdate(req.params.id, book_instance, (err) => {
                if (err) { return next(err); }

                res.redirect(book_instance.url);
            })
        }
    }
];