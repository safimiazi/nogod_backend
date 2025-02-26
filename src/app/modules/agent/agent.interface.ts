import mongoose, { ObjectId } from "mongoose";

export interface IAgent {
    _id?: ObjectId;
    user_id: mongoose.Types.ObjectId;
    is_approved: 'approved' | 'pending' | 'rejected';
    income: number;
    mobile: string;

    created_at?: Date;
    updated_at?: Date;
}
