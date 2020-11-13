const { Mongoose } = require("mongoose");

var mongoose = require('mongoose')


var AuthorSchema = new mongoose.Schema({
    first_name : {type: String, required: true, maxlength: 100},
    family_name : {type: String, required: true, maxlength: 100},
    date_of_birth : {type: Date},
    date_of_death : {type: Date}
})

// virtual are those attributes that are not stored but can be fetched using get
// virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
    return this.first_name + ' ' + this.family_name;
});


//virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get( () => {
    return (this.date_of_death.getYear() - this.date_of_birth.getYear());
});


// virtual for author's URL
AuthorSchema
.virtual('url')
.get( () => {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);