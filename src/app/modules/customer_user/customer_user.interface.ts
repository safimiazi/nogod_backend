import mongoose, { ObjectId } from "mongoose";

export interface ICustomerUser {
    _id?: ObjectId;
    user_id: mongoose.Types.ObjectId;
    bonus: number;
    mobile: string;

    created_at?: Date;
    updated_at?: Date;
}
