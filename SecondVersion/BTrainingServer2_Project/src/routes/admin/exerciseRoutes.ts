import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../../middlewares/errors";
import { authenticate } from "../../middlewares/auth";
import { requireRoleAdmin } from "../../middlewares/roleAdmin";
import { ExerciseController } from "../../controllers/admin/ExerciseController";
import { upload } from "../../middlewares/uploadMulter";

const router = Router();
router.use(authenticate);
router.use(requireRoleAdmin);

router.post(
    "/add",
    upload.single("exerciseImage"),
    body("name").notEmpty().withMessage("Name is required"),
    body("description")
        .isLength({ max: 100 })
        .withMessage("Description can be up to 100 characters long"),
    body("muscle").notEmpty().withMessage("Muscle is required"),
    body("level").notEmpty().withMessage("Level is required"),
    handleInputErrors,
    ExerciseController.addExercise
);

router.put(
    "/edit/:id",
    upload.single("exerciseImage"),
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 30 })
        .withMessage("Name can be up to 30 characters long"),
    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 100 })
        .withMessage("Description can be up to 100 characters long"),
    body("muscle").notEmpty().withMessage("Muscle is required"),
    body("level").notEmpty().withMessage("Level is required"),
    param("id").isMongoId().withMessage("Invalid exercise ID"),
    handleInputErrors,
    ExerciseController.editExercise
);

router.delete(
    "/delete/:id",
    param("id").isMongoId().withMessage("Invalid exercise ID"),
    handleInputErrors,
    ExerciseController.deleteExercise
);

router.get(
    "/:id",
    param("id").isMongoId().withMessage("Invalid exercise ID"),
    handleInputErrors,
    ExerciseController.getExerciseById
);

router.post(
    "/nonDelete/:id",
    param("id").isMongoId().withMessage("Invalid exercise ID"),
    handleInputErrors,
    ExerciseController.nonDeleteExercise
);

router.get("/exercises", ExerciseController.getExercises);
export default router;
