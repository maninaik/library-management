var mongoose = require('mongoose')


var GenreSchema = mongoose.Schema({
    name : {type: String, required: true, minlength: 3, maxlength: 100},
    books : {type: mongoose.Schema.Types.ObjectId, ref: 'book'},

});

//virtual to get Genre's URL

GenreSchema
.virtual('url')
.get( () => {
    return '/catalog/genre/' + this._id;
});

module.exports = mongoose.model('genre', GenreSchema);