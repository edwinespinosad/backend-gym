import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js';
import { createSuggestion, getSuggestions } from "../controllers/suggestion.controller.js";

const router = Router()

router.get('/suggestions', authMiddleware, getSuggestions)
router.post('/suggestions', authMiddleware, createSuggestion)

export default router
