import express from 'express'
import {auth} from '../middlewere/token.js'
import { CreateTransaction, GetTransaction, GetTransactionDetails } from '../controller/transaction.controller.js'

export const transactionRoutes=express.Router()

transactionRoutes.post('/',auth,CreateTransaction)

transactionRoutes.get('/',auth,GetTransaction)

transactionRoutes.get('/transaction/:transactionId',auth,GetTransactionDetails)