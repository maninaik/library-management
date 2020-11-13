var mongoose = require('mongoose')
const book = require('./models/book')
var bookModel = require('./models/book')
var authorModel = require('./models/author')
var mongodb = 'mongodb+srv://libraryManagementUser:12345@cluster0.brvbr.mongodb.net/library-management-db?retryWrites=true&w=majority'


mongoose.connect(mongodb, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then( () =>{
    console.log('connection established')

    authorModel.create({
        first_name : 'c',
        last_name : 'd'
    }).then(result => console.log(result))
})
.catch( (err) =>{
    console.log(err)
})

var db = mongoose.connection


// mongoose.connection.close().then( () => {
//     console.log('connection closed')
// })