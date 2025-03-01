import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";
import { AdminControllers } from "./admin.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.get("/", auth('admin', 'superAdmin'), AdminControllers.getAllAdmin);
router.get("/:id", auth('admin', 'superAdmin'), AdminControllers.getSingleAdmin);
router.delete("/:id", auth('superAdmin'), AdminControllers.deleteSingleAdmin);
router.patch("/:id", auth('superAdmin'), validateRequest(adminValidations.updateAdminValidationSchema), AdminControllers.updateAdmin)
export const AdminRoutes = router;
