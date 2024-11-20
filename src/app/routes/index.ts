import { Router } from "express";
import { userRoutes } from "../modules/User/user.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { profileRoutes } from "../modules/Profile/profile.route";
import { specialtiesRoutes } from "../modules/Specialties/specialties.route";
import { doctorRoutes } from "../modules/Doctor/doctor.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/profile",
    route: profileRoutes,
  },
  {
    path: "/admins",
    route: adminRoutes,
  },
  {
    path: "/doctors",
    route: doctorRoutes,
  },
  {
    path: "/specialties",
    route: specialtiesRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
