/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { User } from "../User/user.model";
import { AdminSearchableFields } from "./admin.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { agentModel } from "../agent/agent.model";
import { customerUserModel } from "../customer_user/customer_user.model";


const getAllAgentFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(agentModel.find({ is_approved: "pending", status: "active" }), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery.populate("user_id") 
  .exec();
  const meta = await userQuery.countTotal();
  return {
    result,
    meta,
  };
};


const getAllCustomerUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(customerUserModel.find({  status: "active" }), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery.populate("user_id")
  .exec();
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



const blockUserFromDB = async (userId: string, agentId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Block the user
    const blockedUser = await User.findByIdAndUpdate(
      { _id: userId }, 
      { status: "blocked" }, 
      { new: true, session }
    );

    if (!blockedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to block user");
    }

    // Block the agent
    const blockedAgent = await agentModel.findByIdAndUpdate(
      { _id: agentId }, 
      { status: "blocked" }, 
      { new: true, session }
    );

    if (!blockedAgent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to block agent");
    }

    await session.commitTransaction();
    return { blockedUser, blockedAgent };

  } catch (err: any) {
    await session.abortTransaction();
    throw new Error(err.message);
  } finally {
    await session.endSession();
  }

};
const agentApprovalFromDB = async (id: string, action : string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const actionAgent = await agentModel.findByIdAndUpdate(
      id,
      { is_approved: `${action === "reject"? "rejected" : "approved"}` },
      { new: true, session },
    );

    if (!actionAgent) {
      throw new AppError(httpStatus.BAD_REQUEST, `Failed to ${action === "reject"? "reject" : "approve"} agent`);
    }

   

    await session.commitTransaction();
    await session.endSession();

    return actionAgent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const AdminServices = {
  getAllAgentFromDB,
 getSingleUserFromDB,
 blockUserFromDB
 ,agentApprovalFromDB,getAllCustomerUserFromDB
 
};
