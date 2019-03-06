let mongoose = require('mongoose')

// Create the Schema
let userSchema =mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname : {
        type: String,
        required: true
    },
    mobileno: {
        type: Number,
        required: true
    },
    addeddate: {
        type: Date,
        default: new Date()
    },
    customertype : {
        type: String,
        default : 'normal'
    }
},{
    strict: false,
    collection : 'user'
});
// Attach the Schema to the Model and Export it for use in
// Other files
module.exports= mongoose.model('user',userSchema)