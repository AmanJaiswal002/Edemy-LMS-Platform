import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import ConnectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import paymentRouter from './routes/paymentRoutes.js'

// Tnitialize Express
const app = express()

// Conect to database
await connectDB()
await ConnectCloudinary()

// Middlewares
app.use(cors())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res)=> res.send("API Working"))
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.use('/api/payment', express.json(), paymentRouter)


// Educator Routes
app.use('/api/educator', express.json(), educatorRouter)


// Clerk Webhook Route
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
   console.log(`Server is running on port ${PORT}`)
})