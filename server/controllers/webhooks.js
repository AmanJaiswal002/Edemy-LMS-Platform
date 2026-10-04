import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Fetch raw payload string and headers
        const payloadString = req.body.toString('utf8');
        
        await whook.verify(payloadString, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const parsedBody = JSON.parse(payloadString);
        const { data, type } = parsedBody;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name ? data.first_name + (data.last_name ? ' ' + data.last_name : '') : (data.email_addresses[0].email_address || 'Test User'),
                    imageUrl: data.image_url || "",
                };

                await User.findByIdAndUpdate(data.id, userData, { upsert: true });
                res.json({ success: true });
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: (data.first_name || "") + " " + (data.last_name || ""),
                    imageUrl: data.image_url || "",
                };

                await User.findByIdAndUpdate(data.id, userData);
                res.json({ success: true });
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                res.json({ success: true });
                break;
            }

            default:
                res.json({ success: true });
                break;
        }

    } catch (error) {
        console.error("Clerk Webhooks Code Fix Error:", error.message);
        res.json({success: false, message: error.message})
    }
};