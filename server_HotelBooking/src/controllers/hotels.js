import Hotel from "../models/hotels.js";
import User from "../models/userModels.js";


export const registerHotel = async (req,res)=>{
    try {
        const {name, address, contact, city} = req.body;
        const owner = req.user._id


        const hotel = await Hotel.findOne({owner})
        if(hotel){
            return res.json({success:false, message:"Hotel Already Registered"})
        }
        await Hotel.create({ name, address, contact, city, owner })
        await Hotel.findByIdAndUpdate(owner,{role:"hotelOwner"})
        res.json({success:true, message:"Hotel Registered Successfully"})
    } catch (error) {
        
    }
}