import { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { authRoutes } from "../modules/Auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/admins",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
