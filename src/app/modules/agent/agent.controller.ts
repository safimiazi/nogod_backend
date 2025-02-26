import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AgnetServices } from './agent.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

export const AgentController = {
  cashInUserThroughAgent: catchAsync(async (req: Request, res: Response) => {
    const { userPhone, amount, agentPin } = req.body;
    const { mobile: agentPhone } = req.user;
    const result = await AgnetServices.cashInUserThroughAgent(
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

  ApprovedAgents :catchAsync(async (req, res) => {
    const result = await AgnetServices.getAllApprovedAgent(req.query);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Agents are retrieved succesfully',
      meta: result.meta,
      data: result.result,
    });
  })
};
