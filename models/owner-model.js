const mongoose = require('mongoose')

let ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: 3
    },
    email: String,
    password: String,
    products: {
        type: Array,
        default: []
    },
    picture: String,
    gstin: String
})

module.exports = mongoose.model('owner', ownerSchema)