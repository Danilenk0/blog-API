import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true,
        unique:true,
    },
    tags:{
        type:Array,
        default:[],
    },
    viewsCount:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    imageUrl:String

},{
    timestamps:true,
    strictPopulate: false 
})

export default mongoose.model('Post', PostSchema)