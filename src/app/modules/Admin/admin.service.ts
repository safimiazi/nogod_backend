/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { User } from "../User/user.model";
import { AdminSearchableFields } from "./admin.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";


const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findOne({_id: id});
  return result;
};



const blockUserFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const blockUser = await User.findByIdAndUpdate(
      id,
      { status: "block" },
      { new: true, session },
    );

    if (!blockUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to block student');
    }

   

    await session.commitTransaction();
    await session.endSession();

    return blockUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const AdminServices = {
 getAllUsersFromDB,
 getSingleUserFromDB,
 blockUserFromDB
};
