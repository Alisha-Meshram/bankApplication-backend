import express from 'express'

import { ChangePassword, ChangePin, GetAllUsers, GetUserBalance, Logout } from '../controller/user.controller.js'
import { auth } from '../middlewere/token.js'

export const UserRoutes=express.Router()

UserRoutes.get('/balance',auth,GetUserBalance)

UserRoutes.post('/change-password',auth,ChangePassword)

UserRoutes.post('/change-pin',auth,ChangePin)

UserRoutes.get('/users',auth,GetAllUsers)

UserRoutes.post('/logout',auth,Logout)