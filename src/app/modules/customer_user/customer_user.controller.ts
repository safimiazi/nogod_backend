import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { CustomerUserServices } from './customer_user.service';

const UserSendMoneyToUser = async (req: Request, res: Response) => {
    const {amount, receiverPhone} = req.body;
    const {mobile: senderPhone} = req.user;
     const result = await CustomerUserServices.UserSendMoneyToUserIntoDb(senderPhone, receiverPhone, amount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money is sent successfully!',
    data: result,
  });
};

export const CustomerUserControllers = {
  UserSendMoneyToUser,
};
