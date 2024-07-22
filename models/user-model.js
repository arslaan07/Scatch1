const mongoose = require('mongoose')

mongoose.connect(`mongodb://127.0.0.1:27017/scatch`)

let userSchema = mongoose.Schema({
    fullname:  {
        type: String,
        minLength: 3,
        trim: 3
    },
    email: String,
    password: String,
    cart: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
        }
    ],
    orders: {
        type: Array,
        default: []
    },
    contact: Number,
    picture: String
})

module.exports = mongoose.model('user', userSchema)

