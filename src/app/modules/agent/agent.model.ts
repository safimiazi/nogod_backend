import mongoose, { model } from "mongoose";
import { IAgent } from "./agent.interface";

const agentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    is_approved: { type: Boolean, default: false },
    income: { type: Number, default: 0},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const agentModel = model<IAgent>('Agent', agentSchema);
