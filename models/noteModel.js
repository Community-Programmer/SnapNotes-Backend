const mongoose=require('mongoose')

const noteSchema=mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    }
    ,
    description:{
        type:String,
        required:true
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    }

},{timestamps:true})

module.exports=mongoose.model('Note',noteSchema)