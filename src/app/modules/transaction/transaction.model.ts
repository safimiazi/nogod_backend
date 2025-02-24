import mongoose from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transaction_fee: { type: Number, default: 0.0 },
    transaction_type: { type: String, enum: ['cash_in', 'cash_out', 'send_money'], required: true },
    transaction_id: { type: String, unique: true, required: true },
    created_at: { type: Date, default: Date.now }
});

export const transactionModel = mongoose.model<ITransaction>('Transaction', transactionSchema);
