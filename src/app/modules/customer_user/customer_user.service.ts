import mongoose from 'mongoose';
import { User } from '../User/user.model';
import { sendNotification } from '../../utils/notification';
import { transactionModel } from '../transaction/transaction.model';
import { generateRandomUniqueNumber } from '../../utils/generate_rendom_unique_number';
import { transaction_type } from '../../utils/constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { USER_ROLE } from '../User/user.constant';
import { Admin } from '../Admin/admin.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
const SEND_MONEY_FEE = 5;
const MIN_SEND_AMOUNT = 50;
const FEE_THRESHOLD = 100;

const UserSendMoneyToUserIntoDb = async (
  senderPhone: string,
  receiverPhone: string,
  amount: number,
) => {
  if (Number(amount) < MIN_SEND_AMOUNT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Minimum amount to send is ${MIN_SEND_AMOUNT} Taka.`,
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findOne({ mobile: senderPhone }).session(session);
    const receiver = await User.findOne({ mobile: receiverPhone }).session(
      session,
    );
    const adminUser = await User.findOne({ role: USER_ROLE.admin }).session(
      session,
    );
    if (!sender || !receiver || !adminUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Sender, Receiver, or Admin not found.',
      );
    }
    const admin = await Admin.findOne({ user: adminUser._id }).session(session);
    if (!admin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Admin not found.');
    }
    let transactionFee = 0;
    if (Number(amount) > FEE_THRESHOLD) {
      transactionFee = SEND_MONEY_FEE;
    }

    const totalDeductible = Number(amount) + transactionFee;
    if (sender.balance < totalDeductible) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance.');
    }

    // Update balances
    const newSenderBalance = sender.balance - totalDeductible;
    const newReceiverBalance = receiver.balance + Number(amount);
    const newAdminTotalMoneyInSystem =
      admin.total_money_in_system + transactionFee;

    await User.updateOne(
      { mobile: senderPhone },
      { balance: newSenderBalance },
      { session },
    );
    await User.updateOne(
      { mobile: receiverPhone },
      { balance: newReceiverBalance },
      { session },
    );
    await Admin.updateOne(
      { user: adminUser._id },
      { total_money_in_system: newAdminTotalMoneyInSystem },
      { session },
    );

    // **Record Transaction in transactionModel**
    const transactionRecord = new transactionModel({
      sender_id: sender._id,
      receiver_id: receiver._id,
      amount: Number(amount),
      transaction_fee: transactionFee,
      transaction_type: transaction_type.send_money,
      transaction_id: generateRandomUniqueNumber(), // Unique transaction ID
    });

    await transactionRecord.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Send notifications
    sendNotification(
      senderPhone,
      `You have sent ${amount} Taka to ${receiverPhone}.`,
    );
    sendNotification(
      receiverPhone,
      `You have received ${amount} Taka from ${senderPhone}.`,
    );
    sendNotification(
      'admin',
      `Transaction fee of ${transactionFee} Taka added to the system.`,
    );

    return { senderPhone, receiverPhone, amount, transactionFee };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const CustomerUserServices = {
  UserSendMoneyToUserIntoDb,
};
