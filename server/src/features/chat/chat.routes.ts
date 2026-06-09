import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { getCurrentSessionChat } from "./chat.controller";

const router = Router();

router.use(authenticate);

router.get('/get-session-chats', authorize('resident'), getCurrentSessionChat);

export default router;