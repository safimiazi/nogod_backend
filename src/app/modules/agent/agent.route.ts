/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { CashInController } from './agent.controller';

const router = express.Router();

router.post('/cash-in',auth(USER_ROLE.agent) ,CashInController.cashInUserThroughAgent);




export const agentRoute = router;
