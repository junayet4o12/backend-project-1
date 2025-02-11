import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";
import { AdminControllers } from "./admin.controller";
const router = express.Router();

router.get("/", AdminControllers.getAllAdmin);
router.get("/:adminId", AdminControllers.getSingleAdmin);
router.delete("/:adminId", AdminControllers.deleteSingleAdmin);
router.patch("/:adminId", validateRequest(adminValidations.updateAdminValidationSchema), AdminControllers.updateAdmin)
export const AdminRoutes = router;
