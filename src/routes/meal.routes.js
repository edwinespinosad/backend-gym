import { Router } from "express";
import authMiddleware from '../middlewares/auth.middleware.js';
import { createMeal, getMeals, updateMeal } from "../controllers/meal.controller.js";
import multer from 'multer';

const storageM = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`)
    }
});

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.get('/meals', authMiddleware, getMeals)
router.post('/meals', authMiddleware, upload.single('file'), createMeal)
router.patch('/meals/:id', authMiddleware, upload.single('file'), updateMeal)

export default router
