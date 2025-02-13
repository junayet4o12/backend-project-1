import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validation";
import { AdminControllers } from "./admin.controller";
const router = express.Router();

router.get("/", AdminControllers.getAllAdmin);
router.get("/:id", AdminControllers.getSingleAdmin);
router.delete("/:id", AdminControllers.deleteSingleAdmin);
router.patch("/:id", validateRequest(adminValidations.updateAdminValidationSchema), AdminControllers.updateAdmin)
export const AdminRoutes = router;
