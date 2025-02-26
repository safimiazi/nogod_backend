import  mongoose, { ObjectId } from "mongoose";

export interface ICustomerUser {
    _id?: ObjectId;
    user_id: mongoose.Types.ObjectId;
    bonus: number;
    mobile: string;
    status:  'blocked'| 'active';

    created_at?: Date;
    updated_at?: Date;
}
