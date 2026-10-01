import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

// Tnitialize Express
const app = express()

// Conect to database
await connectDB()

// Middlewares
app.use(cors())

// Route
app.get('/', (req, res)=> res.send("API Working"))

const clerkBodyParser = express.json({
  verify: function(req, res, buf) {
    req.rawBody = buf;
  }
});
app.post('/clerk', clerkBodyParser, clerkWebhooks)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
   console.log(`Server is running on port ${PORT}`)
})