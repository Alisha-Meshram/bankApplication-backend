import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    balance:{type:Number,default:0},
    transactionpin:{type:String,required:true},
    isverified:{type:Boolean,default:false}
})

export const User=mongoose.model('User',userSchema)