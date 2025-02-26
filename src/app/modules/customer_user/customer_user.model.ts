import mongoose from "mongoose";
import { ICustomerUser } from "./customer_user.interface";

const customerUserSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bonus: { type: Number, default: 0 },
    mobile: {type: String},
    status: {
        type: String,
        enum: ['blocked', 'active'],
        default: 'active',
      },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const customerUserModel = mongoose.model<ICustomerUser>('CustomerUser', customerUserSchema);
