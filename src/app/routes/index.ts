import { Router } from 'express';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

import { UserRoutes } from '../modules/User/user.route';
import { customerUserRoute } from '../modules/customer_user/customer_user.route';
import { agentRoute } from '../modules/agent/agent.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/agent',
    route: agentRoute,
  },
  
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/customer-user',
    route: customerUserRoute,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
