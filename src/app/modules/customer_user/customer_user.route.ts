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


export const UserRoutes = router;
