/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/registration',

  UserControllers.registration,
);
router.get(
  '/all-users',
  auth( USER_ROLE.admin),
  UserControllers.GetAllUsers,
);


router.post(
  '/change-status/:id',
  auth( USER_ROLE.admin),
  UserControllers.changeStatus,
);

router.get(
  '/me',
  auth(
    USER_ROLE.admin,
    USER_ROLE.agent,
    USER_ROLE.user,
  ),
  UserControllers.getMe,
);

export const UserRoutes = router;
