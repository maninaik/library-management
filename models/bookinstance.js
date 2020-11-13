var mongoose = require('mongoose')

var BookInstanceSchema = new mongoose.Schema({
    book : {type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint : {type: String, required: true},
    status : {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back : {type: Date, default: Date.now}
});

//virtual for bookInstance's URL
BookInstanceSchema
.virtual('url')
.get( () => {
    return '/catalog/bookinstance/' + this._id;
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);