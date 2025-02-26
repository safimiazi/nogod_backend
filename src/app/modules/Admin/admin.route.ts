import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { AdminControllers } from './admin.controller';
import { AdminServices } from './admin.service';

const router = express.Router();

router.get(
  '/agents',
  auth( USER_ROLE.admin),
  AdminControllers.getAllAgent,
);
// router.put(
//   '/agent',
//   auth( USER_ROLE.admin),
//   AdminControllers.agentApproval,
// );

router.put(
  '/agent',
  auth( USER_ROLE.admin),
  AdminControllers.agentApproval,
);



router.get(
  '/:id',
  auth( USER_ROLE.admin),
  AdminControllers.getSingleUser,
);

router.get(
  '/hello',
  AdminServices.getSystemStats,
);

router.get(
  '/:id',
  auth( USER_ROLE.admin),
  AdminControllers.getSingleUser,
);






router.put(
  '/user-block',
  auth(USER_ROLE.admin),
  AdminControllers.blockUser,
);

export const AdminRoutes = router;
