var mongoose = require('mongoose');
var {DateTime} = require('luxon');

var BookInstanceSchema = new mongoose.Schema({
    book : {type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint : {type: String, required: true},
    status : {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back : {type: Date, default: Date.now}
});

//virtual for bookInstance's URL
BookInstanceSchema
.virtual('url')
.get( function (){ return '/catalog/bookinstance/' + this._id} ); //always remember not to use arrow as it doesn't bind this to your schema

// virtual to get date in a formatted form eg: Nov 13, 2020
BookInstanceSchema
.virtual('due_back_formatted') 
.get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});
module.exports = mongoose.model('BookInstance', BookInstanceSchema);