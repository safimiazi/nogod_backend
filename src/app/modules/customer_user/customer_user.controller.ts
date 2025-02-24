/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { CustomerUserServices } from './customer_user.service';
import catchAsync from '../../utils/catchAsync';

const UserSendMoneyToUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { amount, mobile: receiverPhone } = req.body;
    const { mobile: senderPhone } = req.user;
    const result = await CustomerUserServices.UserSendMoneyToUserIntoDb(
      senderPhone,
      receiverPhone,
      amount,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Money is sent successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const UserCashOut = catchAsync(async (req: Request, res: Response) => {
  const { agentPhone, amount, accountPin } = req.body;
  const { mobile: userPhone } = req.user;
  const result = await CustomerUserServices.UserCashOutIntodb(
    userPhone,
    agentPhone,
    amount,
    accountPin,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cash-out transaction completed successfully.',
    data: result,
  });
});

export const CustomerUserControllers = {
  UserSendMoneyToUser,
  UserCashOut,
};
