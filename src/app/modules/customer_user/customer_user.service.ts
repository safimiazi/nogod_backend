import mongoose from "mongoose";
import { User } from "../User/user.model";
import { Admin } from "../Admin/admin.model";
import { sendNotification } from "../../utils/notification";

/* eslint-disable @typescript-eslint/no-explicit-any */
const SEND_MONEY_FEE = 5;
const MIN_SEND_AMOUNT = 50;
const FEE_THRESHOLD = 100;

const UserSendMoneyToUserIntoDb = async (senderPhone: string, receiverPhone: string, amount: number) => {
    if (amount < MIN_SEND_AMOUNT) {
      throw new Error(`Minimum amount to send is ${MIN_SEND_AMOUNT} Taka.`);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sender = await User.findOne({ mobile: senderPhone }).session(session);
      const receiver = await User.findOne({ mobile: receiverPhone }).session(session);
      const admin = await Admin.findOne().session(session);

      if (!sender || !receiver || !admin) {
        throw new Error('Sender, Receiver, or Admin not found.');
      }

      let transactionFee = 0;
      if (amount > FEE_THRESHOLD) {
        transactionFee = SEND_MONEY_FEE;
      }

      const totalDeductible = amount + transactionFee;
      if (sender.balance < totalDeductible) {
        throw new Error('Insufficient balance.');
      }

      // Update balances
      sender.balance -= totalDeductible;
      receiver.balance += amount;
      admin.total_money_in_system += transactionFee;

      await sender.save({ session });
      await receiver.save({ session });
      await admin.save({ session });

      await session.commitTransaction();
      session.endSession();

      // Send notifications
      sendNotification(senderPhone, `You have sent ${amount} Taka to ${receiverPhone}.`);
      sendNotification(receiverPhone, `You have received ${amount} Taka from ${senderPhone}.`);
      sendNotification('admin', `Transaction fee of ${transactionFee} Taka added to the system.`);

      return { senderPhone, receiverPhone, amount, transactionFee };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };




// }

export const CustomerUserServices = {
    UserSendMoneyToUserIntoDb
}