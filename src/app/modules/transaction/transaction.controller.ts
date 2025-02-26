import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { transactionServices } from "./transaction.service";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

const getAllTransection = catchAsync(async (req : Request, res: Response) => {


    const {userId} = req.user
    const result = await transactionServices.getAllTransectionFromDB(req.query, userId);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction are retrieved succesfully',
      meta: result.meta,
      data: result.result,
    });
  });

export const transactionControllers = {
    getAllTransection
}