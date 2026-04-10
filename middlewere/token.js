import jwt from 'jsonwebtoken'
import { User } from '../modules/User.Models.js'

export const auth =async(req,res,next)=>{

    try {
        const token= req.headers.authorization.split(" ")[1]

        console.log(token,'token')
        
        const decode=jwt.verify(token,process.env.SECRET_KEY)
        console.log(decode,'decode')
        req.user=await User.findById(decode.id).select('-password')

        if(!req.user){
            return res.status(401).json({message:"User not found"})
        }

        console.log('user found',req.user)

       

        
        next() 
    } catch (error) {
        res.status(500).json({message:error})
    }

}