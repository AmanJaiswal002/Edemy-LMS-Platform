import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller Function to Manage Clerk User with database

export const clerkWebhooks = async (req, res)=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        // Defensive check: grab raw body safely from the verify middleware to prevent json formatting mismatch
        const payloadString = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
        
        await whook.verify(payloadString, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const reqBody = JSON.parse(payloadString)
        const {data, type} = reqBody
        
        const getFullName = (first_name, last_name) => {
            return (first_name || last_name) ? `${first_name || ''} ${last_name || ''}`.trim() : "";
        }

        switch (type) {
            case "user.created": {
                const userData = {
                   _id: data.id,
                   email: data.email_addresses[0].email_address,
                   name: getFullName(data.first_name, data.last_name) || "Google User",
                   imageUrl: data.image_url,
               }
               await User.create(userData)
               res.json({ success: true })
               break;
            }
            
            case "user.updated": {
                const userData = {
                   email: data.email_addresses[0].email_address,
                   name: getFullName(data.first_name, data.last_name) || "Google User",
                   imageUrl: data.image_url,
               }
               await User.findByIdAndUpdate(data.id, userData)
               res.json({ success: true })
               break;
            }

            case "user.deleted" : {
                await User.findByIdAndDelete(data.id)
                res.json({ success: true })
                break;
            }

            default:
                res.json({ success: true });
                break;
        }

    } catch (error) {
        console.error("Webhook Error:", error.message);
        // Important: return 400 so Clerk will automatically retry if there's a problem
        res.status(400).json({success: false, message: error.message})
    }
}