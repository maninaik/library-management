var authorModel = require('../models/author')

// to retrieve all authors
exports.author_list = (req, res) => {
    res.send('NOT IMPLEMENTED author list')
}

//to get details of a particular author
exports.author_detail = (req, res) => {
    res.send('NOT IMPLEMENTED author detail' + req.paarams.id)
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

