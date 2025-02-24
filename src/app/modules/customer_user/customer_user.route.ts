/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import { CustomerUserControllers } from './customer_user.controller';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/send-money',
auth(USER_ROLE.user),
  CustomerUserControllers.UserSendMoneyToUser,
);

router.post('/cash-out',auth(USER_ROLE.user),
CustomerUserControllers.UserCashOut);



export const customerUserRoute = router;
