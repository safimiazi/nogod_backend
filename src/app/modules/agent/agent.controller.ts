import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CashInService } from './agent.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

export const CashInController = {
  cashInUserThroughAgent: catchAsync(async (req: Request, res: Response) => {
    const { userPhone, amount, agentPin } = req.body;
    const { mobile: agentPhone } = req.user;
    const result = await CashInService.cashInUserThroughAgent(
      agentPhone,
      userPhone,
      amount,
      agentPin,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Cash-in successful.',
      data: result,
    });
  }),
};
