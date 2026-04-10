import mongoose from "mongoose";
import { User } from "../modules/User.Models.js";
import bcrypt from "bcrypt";

export const GetUserBalance = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ChangePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current Password  Incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New Password does not match" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();
    res.status(200).json({ message: "Password Change Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const ChangePin=async(req,res)=>{
    const{currentPin,newPin,confirmPin}=req.body
    const userId=req.user.id
try {
    const user=await User.findById(userId)

    const isMatch=await bcrypt.compare(currentPin,user.transactionpin)

    if(!isMatch){
      return  res.status(400).json({message:"Current pin incorrect"})
    }

    if(newPin!==confirmPin){
        return res.status(400).json({ message: "New Pin does not match" });
    }

    const hashPin=await bcrypt.hash(newPin,10)
    user.transactionpin=hashPin

    await user.save()

    res.status(200).json({ message: "Transaction Pin Change Successfully" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

export const GetAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.find({ _id: { $ne: currentUserId } }, "name _id");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const Logout=(req,res)=>{
    req.user=null
    res.status(201).json({message:"Logout Successfull"})
}
