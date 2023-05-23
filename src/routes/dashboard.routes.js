import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js';
import { getIncomes, getMembershipSales, getNewClients, getExpenses, getEarnings } from "../controllers/dashboard.controller.js";

const router = Router()

router.get("/incomes", authMiddleware, getIncomes);
router.get("/expenses-dash", authMiddleware, getExpenses);
router.get("/earnings", authMiddleware, getEarnings);
router.get("/memberships-sales", authMiddleware, getMembershipSales);
router.get("/new-clients", authMiddleware, getNewClients);

export default router
