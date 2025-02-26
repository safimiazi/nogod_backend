/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { transactionControllers } from './transaction.controller';

const router = express.Router();

router.get(
  '/transaction-report',
auth(USER_ROLE.user, USER_ROLE.agent
),
  transactionControllers.getAllTransection,
);
router.get(
  '/agent-transactions',
auth( USER_ROLE.agent, USER_ROLE.admin
),
  transactionControllers.getAgentTransactions,
);


export const transactionRoute = router;
