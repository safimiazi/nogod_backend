import mongoose, { model, Schema } from "mongoose";
import { IAgent } from "./agent.interface";

const agentSchema = new mongoose.Schema<IAgent>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    is_approved: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'pending',
      },
      status: {
        type: String,
        enum: ['blocked', 'active'],
        default: 'active',
      },
      mobile: {
        type: String,
        required: true,
      },
    income: { type: Number, default: 0},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const agentModel = model<IAgent>('Agent', agentSchema);
