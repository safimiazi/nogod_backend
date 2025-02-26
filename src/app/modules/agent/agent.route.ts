/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { AgentController } from './agent.controller';

const router = express.Router();

router.post('/cash-in',auth(USER_ROLE.agent) ,AgentController.cashInUserThroughAgent);

router.get(
    '/approved-agents',
    auth( USER_ROLE.admin),
    AgentController.ApprovedAgents,
  );


export const agentRoute = router;
