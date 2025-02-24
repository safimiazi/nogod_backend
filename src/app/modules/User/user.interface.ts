/* eslint-disable no-unused-vars */
import { USER_ROLE } from './user.constant';

export interface TUser {
  name: string;
  pin: string;
  mobile: string;
  email: string;
  nid: string;
  role:  'admin' | 'user' | 'agent';
  balance: number;
  isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
