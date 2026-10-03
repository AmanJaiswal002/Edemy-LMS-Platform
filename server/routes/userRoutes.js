import express from 'express'
import { getUserData, userEnrolledCourses, syncUser } from '../controllers/userController.js'
import { requireAuth } from '@clerk/express'

const userRouter = express.Router()

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/sync', requireAuth(), syncUser)

export default userRouter;