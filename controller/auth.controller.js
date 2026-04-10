import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../modules/User.Models.js";

export const RegisterUser = async (req, res) => {
  const { name, email, password, confirmpass, transactionpin } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the field" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "user alredy exist" });
    }

    if (password !== confirmpass) {
      return res.status(400).json({ message: "password does not match" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const hashTransactionpin = await bcrypt.hash(transactionpin, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      transactionpin: hashTransactionpin,
      isverified: true,
    });

    res.status(201).json({ message: "Register Successfull" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const ComparePass = await bcrypt.compare(password, user.password);

    if (!ComparePass) {
      return res.status(400).json({ message: "incorrect Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });
    res.status(201).json({ message: "Login successfull", token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getMe = (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
