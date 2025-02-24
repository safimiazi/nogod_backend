/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  name: string;
  pin: string;
  mobile: string;
  email: string;
  nid: string;
  role:  'admin' | 'user' | 'agent';
  status:  'blocked'| 'active';

  balance: number;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {

  //instance methods for checking if passwords are matched
  isPinMatched(
    plainTextPin: string,
    hashedPin: string,
  ): Promise<boolean>;
 
}

export type TUserRole = keyof typeof USER_ROLE;
