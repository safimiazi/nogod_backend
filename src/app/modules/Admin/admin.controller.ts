import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

const getAllAgent = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAgentFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Agents are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  });
});
const getCustomerUser = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllCustomerUserFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer user are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  });
});



const blockUser = catchAsync(async (req, res) => {
  const { userId, agentId } = req.body;
  const result = await AdminServices.blockUserFromDB(userId, agentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is blocked succesfully',
    data: result,
  });
});
const agentApproval = catchAsync(async (req, res) => {
  const { action , id} = req.body;

  const result = await AdminServices.agentApprovalFromDB(id, action);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Agent is ${action === "reject" ? "rejected" : "approved"} succesfully`,
    data: result,
  });
});


export const AdminControllers = {
  getAllAgent,getSingleUser,blockUser,agentApproval,getCustomerUser
};
