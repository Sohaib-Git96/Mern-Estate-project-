import mongoose, { trusted } from "mongoose";
const listingSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }, 
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    regularPrice:{
        type:Number,
        required:true,
    },
    discountPrice:{
        type:Number,
        required:true,
    },
    bathroom:{
        type:String,
        required:true,
    },
    bedroom:{
        type:String,
        required:true,
    },
    furnishes:{
        type:Boolean,
        required:true,
    },
    parking:{
        type:Boolean,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    offer:{
        type:Boolean,
        required:true,
    },
    imageUrls:{
        type:Array,
        required:true,
    },
    userRef:{
        type:String,
        required:true,
    },

},{timestamps:true}
)

const Listing =mongoose.model("Listing",listingSchema)

export default Listing;