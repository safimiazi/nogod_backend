/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { CustomerUserServices } from './customer_user.service';

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


const UserCashOut = async (
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

export const CustomerUserControllers = {
  UserSendMoneyToUser, UserCashOut
};
