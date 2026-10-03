import express from "express";

import {
    createOrder,
    verifyPayment
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();


// Create Order
paymentRouter.post("/create-order", createOrder);


// Verify Payment
paymentRouter.post("/verify", verifyPayment);


export default paymentRouter;