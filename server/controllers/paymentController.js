import razorpay from "../configs/razorpay.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import crypto from "crypto";
import { getAuth } from "@clerk/express";


// Create Razorpay Order
export const createOrder = async (req, res) => {
    try {

        const { courseId, name, email } = req.body;
        console.log("CREATE_ORDER_INCOMING_BODY:", req.body);
        const userId = getAuth(req)?.userId;

        if (!userId) {
            return res.json({ 
                success: false, 
                message: `Auth Failed! getAuth(req).userId is empty` 
            });
        }

        const course = await Course.findById(courseId);
        console.log("FOUND_COURSE:", course);

        if (!course) {
            return res.json({
                success: false,
                message: `Course not found for ID: ${courseId}`
            });
        }

        let user = await User.findById(userId);

        if (!user) {
            // Lazy create user if webhook missed the insertion during development
            user = await User.create({
                _id: userId,
                name: name || "Test User",
                email: email || "test@example.com",
                imageUrl: "https://via.placeholder.com/150",
                enrolledCourses: []
            });
        }

        // Calculate discounted price
        const finalAmount =
            course.coursePrice -
            (course.discount * course.coursePrice) / 100;

        // Razorpay amount is in paise
        const amountInPaise = Math.round(finalAmount * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // Save pending purchase
        await Purchase.create({
            courseId: course._id,
            userId: userId,
            amount: finalAmount,
            status: "pending"
        });

        res.json({
            success: true,
            order
        });

    } catch (error) {

        console.error("Create Order Error:", error);

        res.json({
            success: false,
            message: error.message
        });
    }
};


// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId
        } = req.body;

        const userId = getAuth(req)?.userId;

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized: Token Invalid or Expired" });
        }

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Find pending purchase
        const purchase = await Purchase.findOne({
            courseId,
            userId,
            status: "pending"
        });

        if (!purchase) {
            return res.json({
                success: false,
                message: "Purchase not found"
            });
        }

        // Mark purchase complete
        purchase.status = "complete";
        await purchase.save();

        // Add course to user's enrolled courses
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    enrolledCourses: courseId
                }
            }
        );

        // Add student to course
        await Course.findByIdAndUpdate(
            courseId,
            {
                $addToSet: {
                    enrolledStudents: userId
                }
            }
        );

        res.json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {

        console.error("Verify Payment Error:", error);

        res.json({
            success: false,
            message: error.message
        });
    }
};