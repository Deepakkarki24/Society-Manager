import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { uploadWithoutImage } from "../../middleware/upload";
import { createNewSession, getAllSessions } from "./session.controller";

const router = Router();

router.use(authenticate);

router.post("/create", authorize('resident'), uploadWithoutImage, createNewSession);

// router.get('/get-current-session', authorize('resident'), getCurrentSession);

router.get('/get-sessions', authorize('resident'), getAllSessions);

export default router;