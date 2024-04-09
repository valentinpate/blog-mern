const mongoose = require("mongoose")
const Usuario = require("./Usuario")
const Post = require("./Post")

const banSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Usuario",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    cause:{
        type:String,
        required:true
    }
})

const Ban = mongoose.model('ban', banSchema)

module.exports = Ban