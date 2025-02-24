import mongoose, { ObjectId } from "mongoose";

export interface IAgent {
    _id?: ObjectId;
    user_id: mongoose.Types.ObjectId;
    is_approved: boolean;
    income: number;
    created_at?: Date;
    updated_at?: Date;
}
