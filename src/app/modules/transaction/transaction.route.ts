/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { transactionControllers } from './transaction.controller';

const router = express.Router();

router.post(
  '/transaction-report',
auth(USER_ROLE.user
),
  transactionControllers.getAllTransection,
);


export const UserRoutes = router;
