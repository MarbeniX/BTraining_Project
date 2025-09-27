import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/errors";
import { authenticate } from "../middlewares/auth";
import { TrainingSessionController } from "../controllers/TrainingSessionController";

const router = Router();

router.use(authenticate);

router.post(
    "/start/:routineId",
    param("routineId").optional().isMongoId().withMessage("Invalid routine ID"),
    handleInputErrors,
    TrainingSessionController.startSession
);

router.post(
    "/finish/:sessionId",
    param("sessionId").isMongoId().withMessage("Invalid session ID"),
    body("sessionExercises")
        .isArray({ min: 1 })
        .withMessage("At least one session exercise is required"),
    handleInputErrors,
    TrainingSessionController.finishSession
);

router.get("/sessions", TrainingSessionController.getTrainingSessions);

router.get(
    "/session/:id",
    param("id").isMongoId().withMessage("Invalid session ID"),
    handleInputErrors,
    TrainingSessionController.getTrainingSessionById
);

router.delete(
    "/:id",
    param("id").isMongoId().withMessage("Invalid session ID"),
    handleInputErrors,
    TrainingSessionController.deleteTraningSession
);

router.post(
    "/:id",
    param("id").isMongoId().withMessage("Invalid session ID"),
    handleInputErrors,
    TrainingSessionController.nonDeleteTrainingSession
);

export default router;
