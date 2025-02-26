/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TAdmin } from '../Admin/admin.interface';
import { Admin } from '../Admin/admin.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { IAgent } from '../agent/agent.interface';
import { agentModel } from '../agent/agent.model';
import { ICustomerUser } from '../customer_user/customer_user.interface';
import { customerUserModel } from '../customer_user/customer_user.model';

const registrationIntoDB = async (payload: TUser) => {
  const isUserExists: any = await User.findOne({ email: payload.email }) as TUser | null;
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Account already exists');
  }

  const isUserMobileExists: any = await User.findOne({ mobile: payload.mobile }) as TUser | null;
  if (isUserMobileExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Account already exists');
  }


  // create a user object
  const userData: Partial<TUser> = {};

  //set student role
  userData.role = payload.role;
  userData.name = payload.name;
  userData.pin = payload.pin;
  userData.mobile = payload.mobile;
  userData.email = payload.email;
  userData.balance = payload.role.toLowerCase() === 'user' ? 40 : 0;

  //set admin email
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // create a user (transaction-1)
    const newUser = await User.create([payload], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Failed to create ${payload.role}`,
      );
    }

    let createNewUser: any;

    if (payload.role.toLowerCase() === 'agent') {
      const payload: Partial<IAgent> = {};
      payload.user_id = newUser[0]._id;
      payload.income = 0;
      payload.mobile= newUser[0].mobile;
      createNewUser = await agentModel.create([payload], { session });
    }

    if (payload.role.toLowerCase() === 'user') {
      const payload: Partial<ICustomerUser> = {};
      payload.user_id = newUser[0]._id;
      payload.mobile= newUser[0].mobile;
      payload.bonus = 40;
      createNewUser = await customerUserModel.create([payload], { session });
    }

    await session.commitTransaction();
    await session.endSession();

    return createNewUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  let result = null;

  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  registrationIntoDB,
  getMe,
  changeStatus,
};
