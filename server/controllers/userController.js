import User from "../models/User.js"

// Get User Data
export const getUserData = async (req, res)=>{
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if(!user){
            return res.json({ success: false, message: 'User Not Found'})
        }
        res.json({ success: true, user})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Users Enrolled Course With Lecture Links
export const userEnrolledCourses = async (req, res)=>{
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({success: true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Sync User from Frontend
export const syncUser = async (req, res) => {
    console.log("Incoming syncUser request. auth:", req.auth, "body:", req.body);
    try {
        const userId = req.auth.userId;
        const { name, email, imageUrl } = req.body;

        const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short', hour12: true }).toUpperCase();

        let user = await User.findById(userId);

        if (!user) {
            user = await User.create({
                _id: userId,
                name: name || "Test User",
                email: email || "test@example.com",
                imageUrl: imageUrl || "https://via.placeholder.com/150",
                enrolledCourses: []
            });
        } else {
            await user.save();
        }

        res.json({ success: true, message: "User Synced & timestamp updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
