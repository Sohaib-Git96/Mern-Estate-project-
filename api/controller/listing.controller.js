import Listing from "../models/listing.model.js";
import { errorhandler } from "../utils/error.js";

export const createListing=async (req,res, next)=>{
        const listing=await Listing.create({
            ...req.body,
            userRef:req.user.id,
        })
}
        
export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        console.log("Logged-in user ID:", req.user.id);
        console.log("Listing owner ID:", listing.userRef.toString());  


        if (!listing) {
            return next(errorhandler(404, "Listing not found"));
        }

        if (req.user.id !== listing.userRef.toString()) {
            return next(
                errorhandler(401, "You can only delete your own listing")
            );
        }

        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const updateListing=async (req,res,next)=>{
    const listing=await Listing.findById(req.params.id)
    if(!listing){ 
        return next(errorhandler(404,"listings not found"))
    }
    if(req.user.id!==listing.userRef.toString()){
        return next(errorhandler(401,"You can only update your own listings "))
    }
    try{
        const updateListing=await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true,}
        )
        res.status(200).json(updateListing)
    }catch(error){
        next(error)

    }
}
