import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        imageUrl: { type: String, required: true },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        createdAt: { type: String },
        updatedAt: { type: String }
    }, {timestamps: false}
);

userSchema.pre('save', function(next) {
    const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short', hour12: true }).toUpperCase();
    if (this.isNew) {
        this.createdAt = time;
    }
    this.updatedAt = time;
    next();
});

const User = mongoose.model('User', userSchema);

export default User