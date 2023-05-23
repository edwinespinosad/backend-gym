import { Router } from "express";
import { createRoutine, getRoutines, updateRoutine } from '../controllers/routine.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router()

router.get('/routines', authMiddleware, getRoutines)
router.post('/routines', authMiddleware, createRoutine)
router.patch('/routines/:id', authMiddleware, updateRoutine)

export default router
