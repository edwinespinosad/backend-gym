import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js';
import { getExpenses, createExpense } from "../controllers/expense.controller.js";

const router = Router()

router.get("/expenses", authMiddleware, getExpenses);
router.post('/expenses', authMiddleware, createExpense)

export default router
