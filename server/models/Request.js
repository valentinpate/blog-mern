const mongoose = require('mongoose')
const Usuario = require('./Usuario')

const requestSchema = new mongoose.Schema({
    mail: {
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    body:{
        type:String,
        required:true
    }
})

const Request = mongoose.model('request',requestSchema)

module.exports = Request