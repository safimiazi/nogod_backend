/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../User/user.constant';
import { Admin } from '../Admin/admin.model';
import { sendNotification } from '../../utils/notification';
import { transactionModel } from '../transaction/transaction.model';
import { transaction_type } from '../../utils/constant';
import { generateRandomUniqueNumber } from '../../utils/generate_rendom_unique_number';
import QueryBuilder from '../../builder/QueryBuilder';
import { agentModel } from './agent.model';
import { AdminSearchableFields } from '../Admin/admin.constant';

export const AgnetServices = {
  cashInUserThroughAgent: async (
    agentPhone: string,
    userPhone: string,
    amount: number,
    agentPin: string,
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (Number(amount) <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount.');
      }
      // Find agent and user
      const agentUser = await User.findOne({
        mobile: agentPhone,
        role: USER_ROLE.agent,
      }).session(session);
      const user = await User.findOne({
        mobile: userPhone,
        role: USER_ROLE.user,
      }).session(session);
      const adminUser = await User.findOne({ role: USER_ROLE.admin }).session(
        session,
      );

      if (!agentUser || !user) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Agent, User, or Admin user not found.',
        );
      }

      if (agentUser.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'Agent is blocked');
      }

      if (!adminUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Admin user not found.');
      }

      if (user.status === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
      }

      const admin = await Admin.findOne({ user: adminUser._id }).session(
        session,
      );

      if (!admin) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Admin not found.');
      }

      if (!(await (User as any).isPinMatched(agentPin, agentUser.pin))) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid agent PIN.');
      }

      // Update balances
      user.balance += Number(amount);
      admin.total_money_in_system += Number(amount);

      await user.save({ session });
      await admin.save({ session });


    // **Record transaction history**
    const transactionRecord = new transactionModel({
        sender_id: agentUser._id, // Agent is sending money
        receiver_id: user._id, // User is receiving money
        amount: Number(amount),
        transaction_fee: 0, // No fee for cash-in
        transaction_type: transaction_type.cash_in,
        transaction_id: generateRandomUniqueNumber(), // Unique transaction ID
      });

      await transactionRecord.save({ session });


      await session.commitTransaction();
      session.endSession();

      // Send notifications
      sendNotification(
        userPhone,
        `You have successfully cashed-in ${amount} Taka.`,
      );
      sendNotification(
        agentPhone,
        `You have successfully processed a cash-in of ${amount} Taka.`,
      );

      return { userPhone, amount };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

 getAllApprovedAgent : async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(agentModel.find({ is_approved: "approved" }), query)
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
  }
};
