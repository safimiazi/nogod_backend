/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

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
    status: {
      type: String,
      enum: ['blocked', 'active'],
      default: 'active',
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




userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.pin = await bcrypt.hash(
    user.pin,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.pin = '';
  next();
});

userSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select('+pin');
};

userSchema.statics.isPinMatched = async function (enteredPin: string, storedPin: string): Promise<boolean> {
  return bcrypt.compare(enteredPin, storedPin);
};








export const User = model<TUser>('User', userSchema);
