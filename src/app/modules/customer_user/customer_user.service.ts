import mongoose from 'mongoose';
import { User } from '../User/user.model';
import { sendNotification } from '../../utils/notification';
import { transactionModel } from '../transaction/transaction.model';
import { transaction_type } from '../../utils/constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { USER_ROLE } from '../User/user.constant';
import { Admin } from '../Admin/admin.model';
import { agentModel } from '../agent/agent.model';
import { generateTransactionId } from '../../utils/generate_rendom_unique_number';

/* eslint-disable @typescript-eslint/no-explicit-any */


// for send money
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
    const sender = await User.findOne({ mobile: senderPhone, role: USER_ROLE.user }).session(session);
    const receiver = await User.findOne({ mobile: receiverPhone, role: USER_ROLE.user }).session(
      session,
    );
    const adminUser = await User.findOne({ role: USER_ROLE.admin }).session(
      session,
    );
    if (!sender) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Sender not found.',
      );
    }
    if (!receiver) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Receiver not found.',
      );
    }
    if (!adminUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Admin user not found.',
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
    const adminIncome =
      admin.total_income + transactionFee;

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
      { total_income: adminIncome, },
      { session },
    );

    // **Record Transaction in transactionModel**
    const transactionRecord = new transactionModel({
      sender_id: sender._id,
      receiver_id: receiver._id,
      amount: Number(amount),
      transaction_fee: transactionFee,
      transaction_type: transaction_type.send_money,
      transaction_id: generateTransactionId(), // Unique transaction ID
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



// for cash out
const CASH_OUT_FEE_PERCENT = 1.5; // 1.5% Fee
const AGENT_INCOME_PERCENT = 1.0; // 1% for Agent
const ADMIN_INCOME_PERCENT = 0.5; // 0.5% for Admin


const UserCashOutIntodb = async (
    userPhone: string,
    agentPhone: string,
  amount: number,
  accountPin: string,
) => {
 
    if (Number(amount) <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount.');
      }
    
      const session = await mongoose.startSession();
      session.startTransaction();
    
      try {
        // Find user and agent
        const user = await User.findOne({ mobile: userPhone, role: USER_ROLE.user }).session(session);
        
        const agentUser = await User.findOne({ mobile: agentPhone, role: USER_ROLE.agent }).session(session);
        const adminUser = await User.findOne({ role: USER_ROLE.admin }).session(session);
    
        if (!user || !agentUser || !adminUser) {
          throw new AppError(httpStatus.BAD_REQUEST, 'User, Agent, or Admin not found.');
        }

        if(agentUser.status === 'blocked'){
          throw new AppError(httpStatus.FORBIDDEN, 'Agent is blocked');
        }

        if (user.balance < amount) {
          throw new AppError(httpStatus.BAD_REQUEST, "Insufficient amount for this transaction");
        }
    
        // Validate user's account PIN
        if (!(await (User as any).isPinMatched(accountPin, user?.pin)))
            throw new AppError(httpStatus.FORBIDDEN, 'Pin do not matched');
        
    
        // Find admin
        const admin = await Admin.findOne({ user: adminUser._id }).session(session);
        if (!admin) {
          throw new AppError(httpStatus.BAD_REQUEST, 'Admin not found.');
        }
        // Find agent
        const agent = await agentModel.findOne({ user_id: agentUser._id }).session(session);
        if (!agent) {
          throw new AppError(httpStatus.BAD_REQUEST, 'agent not found.');
        }

        if(agent.is_approved === "pending"){
          throw new AppError(httpStatus.FORBIDDEN, 'Agent is not active yet');
        }
    
        // Calculate fees
        const cashOutFee = parseFloat(((Number(amount) * CASH_OUT_FEE_PERCENT) / 100).toString());
        const agentIncome = parseFloat(((Number(amount) * AGENT_INCOME_PERCENT) / 100).toString());
        const adminIncome = parseFloat(((Number(amount) * ADMIN_INCOME_PERCENT) / 100).toString());
        const totalDeductible = Number(amount) + cashOutFee;
    
        if (user.balance < totalDeductible) {
          throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance.');
        }
    
        // Update balances
        user.balance -= totalDeductible;
        agentUser.balance += amount - agentIncome; // Agent gets amount minus their 1% cut
        admin.total_income += adminIncome; // Admin earns 0.5%
        agent.income += agentIncome; // Agent's income increases
        // Save changes
        await user.save({ session });
        await agentUser.save({ session });
        await admin.save({ session });
        await agent.save({ session });
        // Record transaction
        const transactionRecord = new transactionModel({
          sender_id: user._id,
          receiver_id: agentUser._id,
          amount: amount,
          transaction_fee: cashOutFee,
          transaction_type: transaction_type.cash_out,
          transaction_id: generateTransactionId(),
        });
    
        await transactionRecord.save({ session });
    
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
    
        // Send notifications
        sendNotification(userPhone, `You have successfully cashed out ${amount} Taka.`);
        sendNotification(agentPhone, `You received ${amount - agentIncome} Taka from ${userPhone}.`);
        sendNotification('admin', `Admin earned ${adminIncome} Taka from cash-out transaction.`);
    
        return { userPhone, agentPhone, amount, cashOutFee, agentIncome, adminIncome };
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
};

export const CustomerUserServices = {
  UserSendMoneyToUserIntoDb,UserCashOutIntodb
};
