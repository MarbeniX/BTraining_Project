import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/errors";
import { authenticate } from "../middlewares/auth";
import { RoutineController } from "../controllers/RoutineController";
import { ExerciseController } from "../controllers/admin/ExerciseController";

const router = Router();

router.use(authenticate);

router.post(
    "/create",
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 1, max: 50 })
        .withMessage("Name must be between 1 and 50 characters long"),
    body("description")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Description can be up to 100 characters long"),
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isArray({ min: 1, max: 3 })
        .withMessage("Category must be an array with 1 to 3 items"),
    body("exercises")
        .isArray({ min: 1 })
        .withMessage("At least one exercise is required"),
    handleInputErrors,
    RoutineController.createRoutine
);

router.get("/search-exercise", ExerciseController.getExercises);

router.get("/search-routine", RoutineController.getUserRoutines);

router.get(
    "/user/:routineId",
    param("routineId").isMongoId().withMessage("Invalid user ID"),
    handleInputErrors,
    RoutineController.getUserRoutineById
);

router.delete(
    "/user/:routineId",
    param("routineId").isMongoId().withMessage("Invalid routine ID"),
    handleInputErrors,
    RoutineController.deleteUserRoutineById
);

router.post(
    "/user/:routineId",
    param("routineId").isMongoId().withMessage("Invalid routine ID"),
    handleInputErrors,
    RoutineController.nonDeleteRoutineById
);

router.put(
    "/user/:routineId",
    param("routineId").isMongoId().withMessage("Invalid routine ID"),
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("description")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Description can be up to 100 characters long"),
    body("category").notEmpty().withMessage("Category cannot be empty"),
    body("exercises")
        .isArray({ min: 1 })
        .withMessage("At least one exercise is required"),
    handleInputErrors,
    RoutineController.updateUserRoutineById
);

export default router;
