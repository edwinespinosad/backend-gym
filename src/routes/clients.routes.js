import { Router } from "express";
import { getClients, createClient, deleteClient, updateClient, getClient, statusClient } from '../controllers/clients.controller.js';
import multer from 'multer';
import authMiddleware from '../middlewares/auth.middleware.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`)
    }
});

const upload = multer({ storage })

const router = Router()

router.get('/clients', authMiddleware, getClients)
router.get('/clients/:id', authMiddleware, getClient)
router.post('/clients', authMiddleware, upload.single('file'), createClient)
router.patch('/clients/:id', authMiddleware, upload.single('file'), updateClient)
router.delete('/clients/:id', authMiddleware, deleteClient)
router.patch('/clients/activate/:id', authMiddleware, statusClient)

export default router