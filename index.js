import express from 'express'
import { ConnectDatabase } from './config/db.js';
import dotenv from 'dotenv'
import cors from 'cors'
import { authRoutes } from './routes/auth.routes.js';
import { transactionRoutes } from './routes/Transaction.routes.js';
import { UserRoutes } from './routes/User.routes.js';

const app=express()
dotenv.config()
app.use(express.json())
app.use(cors())
app.use('/api/auth',authRoutes)
app.use('/api/transaction',transactionRoutes)
app.use('/api/user',UserRoutes)
ConnectDatabase()

const port=7000;
app.listen(port,()=>{
console.log(`server is run ${port}`)
})