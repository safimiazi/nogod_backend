/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pin: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    nid: {
      type: String,
      required: true,
    },
    balance: { type: Number, default: 0 }, // default balance is 0

    role: {
      type: String,
      enum: [ 'admin', 'user', 'agent'],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<TUser>('User', userSchema);
