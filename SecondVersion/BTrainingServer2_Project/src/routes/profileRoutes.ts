import { Router } from "express";
import multer from "multer";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/errors";
import { authenticate } from "../middlewares/auth";
import { ProfileController } from "../controllers/ProfileController";
import { upload } from "../middlewares/uploadMulter";

const router = Router();

router.use(authenticate);

router.post(
    "/username",
    body("username")
        .notEmpty()
        .withMessage("The username is required.")
        .matches(/^[a-zA-Z0-9_]{3,30}$/)
        .withMessage(
            "The username must be between 3 and 30 characters and can only contain letters, numbers, and underscores."
        ),
    body("name")
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ max: 50 })
        .withMessage("Name can be up to 50 characters long."),
    handleInputErrors,
    ProfileController.createUsername
);

router.post(
    "/change-password",
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
    body("newPasswordConfirmation")
        .notEmpty()
        .withMessage("Please confirm your new password")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("New passwords do not match");
            }
            return true;
        }),
    handleInputErrors,
    ProfileController.changePassword
);

router.post(
    "/ask-change-email",
    body("newEmail").isEmail().withMessage("Invalid email address"),
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    handleInputErrors,
    ProfileController.askChangeEmail
);

router.post(
    "/change-email/:token",
    param("token")
        .notEmpty()
        .withMessage("Token is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("Invalid token"),
    handleInputErrors,
    ProfileController.changeEmail
);

router.post(
    "/change-avatar",
    upload.single("avatar"),
    ProfileController.changeAvatar
);

export default router;
