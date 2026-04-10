import express from 'express'
import { getMe, LoginUser, RegisterUser } from '../controller/auth.controller.js'
import { auth } from '../middlewere/token.js'

export const authRoutes=express.Router()

authRoutes.post('/registerUser',RegisterUser)
authRoutes.post('/loginUser',LoginUser)

authRoutes.get('/me',auth,getMe)