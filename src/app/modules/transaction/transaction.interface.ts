import { ObjectId } from "mongoose";

export interface ITransaction {
    _id?: ObjectId;
    sender_id: ObjectId;
    receiver_id: ObjectId;
    amount: number;
    transaction_fee: number;
    transaction_type: 'cash_in' | 'cash_out' | 'send_money';
    transaction_id: string;
    created_at?: Date;
}
