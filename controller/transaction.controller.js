import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../modules/User.Models.js";
import { Transaction } from "../modules/transaction.models.js";

export const CreateTransaction = async (req, res) => {
  const { type, amount, recipient, transactionpin } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const isValidPin = await bcrypt.compare(
      transactionpin,
      user.transactionpin
    );

    if (!isValidPin) {
      return res.status(400).json({ message: "This pin not valid" });
    }

    const TransactionAmount = Number(amount);
    if (isNaN(TransactionAmount) || TransactionAmount <= 0) {
      return res.status(400).json({ message: "Invalid Amount" });
    }

    if (type === "deposite") {
      user.balance += TransactionAmount;

      const depositeTransaction = await Transaction({
        user: userId,
        type: "deposite",
        amount: TransactionAmount,
        status: "success",
      }).save();

      await user.save();
      return res.status(201).json({ message: "deposite successfull" });
    }

    if (type === "send") {
      if (!recipient) {
        return res
          .status(400)
          .json({ message: "Recipient is requird for send money" });
      }
      if (user.balance < TransactionAmount) {
        return res.status(400).json({ message: "insuffitient money" });
      }

      const recipientUser = await User.findById(recipient);
      if (!recipientUser) {
        return res.status(400).json({ message: "recipient not valid" });
      }

      const transaction = await Transaction({
        user: userId,
        type: "send",
        amount: TransactionAmount,
        sender: userId,
        recipient: recipient,
        status: "pending",
      }).save();

      try {
        user.balance -= TransactionAmount;
        recipientUser.balance += TransactionAmount;

        await user.save();
        await recipientUser.save();

        transaction.status = "success";
        await transaction.save();

        res
          .status(201)
          .json({ message: "transaction successfull", transaction });
      } catch (error) {
        console.error("transaction error", error);

        user.balance += TransactionAmount;
        recipientUser.balance -= TransactionAmount;

        await user.save();
        await recipientUser.save();

        transaction.status = "failed";
        transaction.errorMessage = "transaction failed during the process";
        await transaction.save();

        return res
          .status(500)
          .json({ message: "Transaction failed", transaction }); // Respond with failure message
      }
    }

    return res.status(400).json({ message: "Invalid transaction type" });
  } catch (error) {
    console.error("transaction error", error);
    res.status(500).json({ message: "server error" });
  }
};

//all transaction

export const GetTransaction = async (req, res) => {
  const userId = req.user.id;
  try {
    const sendTransaction = await Transaction.find({ sender: userId }).populate("recipient","name email")

    const recieveTransaction = await Transaction.find({ recipient: userId }).populate("sender","name email")

    const depositeTransaction = await Transaction.find({
      user: userId,
      type: "deposite",
    }).populate("user","name email")

    const getTransaction = [
      ...sendTransaction,
      ...recieveTransaction,
      ...depositeTransaction,
    ];

    res.status(200).json({ getTransaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//transaction details

export const GetTransactionDetails = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await Transaction.findById( transactionId ).populate(
      "sender",
      "name email"
    ).populate("recipient","name email");

    if(!transaction){
      return res.status(400).json({message:'Transaction not found'})
    }
    const transactionDetails={
      _id:transaction._id,
      type:transaction.type,
      date:transaction.date,
      amount:transaction.amount,
      sender:
      transaction.type === "deposite"
        ? { username: "You" }
        : {
            _id: transaction.sender?._id || null,
            username: transaction.sender?.name || "unknown",
          },
    
    recipient:
      transaction.type === "deposite"
        ? { username: "Self" }
        : {
            _id: transaction.recipient?._id || null,
            username: transaction.recipient?.name || "Anonymous",
          },
      message:transaction.message||'No message provide',
      transactionpin:transaction.transactionpin||'No pin available'

    }
    res.status(200).json({transactionDetails})
  } catch (error) {
    console.error("Error featching transaction error", error);
    res.status(500).json({ message: "Server error" });
  }
};
