import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/errors";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post(
    "/register",
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("passwordConfirmation").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    handleInputErrors,
    AuthController.localRegister
);

router.post("/google", AuthController.authGoogle);

router.post(
    "/confirm/:token",
    param("token").notEmpty().withMessage("Token is required"),
    param("token").isLength({ min: 6, max: 6 }).withMessage("Invalid token"),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post(
    "/ask-new-token",
    body("email").isEmail().withMessage("Invalid email address"),
    handleInputErrors,
    AuthController.askNewConfirmationToken
);

router.post(
    "/local-login",
    body("identifier")
        .notEmpty()
        .withMessage("Identifier is required")
        .custom((value) => {
            const isEmail = /\S+@\S+\.\S+/.test(value);
            const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(value);
            if (!isEmail && !isUsername) {
                throw new Error("Identifier must be a valid email or username");
            }
            return true;
        }),
    body("password").notEmpty().withMessage("Password is required"),
    handleInputErrors,
    AuthController.localLogin
);

router.post(
    "/ask-reset-password",
    body("email").isEmail().withMessage("Invalid email address"),
    handleInputErrors,
    AuthController.askResetPassword
);

router.post(
    "/new-password/:token",
    param("token").notEmpty().withMessage("Token is required"),
    param("token").isLength({ min: 6, max: 6 }).withMessage("Invalid token"),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("passwordConfirmation")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    handleInputErrors,
    AuthController.newPassword
);

export default router;
