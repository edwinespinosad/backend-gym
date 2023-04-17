import { Router } from "express";
import { getInstructors, createInstructor, deleteInstructor, updateInstructor, getInstructor, statusInstructor } from '../controllers/instructor.controller.js';
import multer from 'multer';
import authMiddleware from '../middlewares/auth.middleware.js';

const storageM = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'src/public/uploads')
    // },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`)
    }
});

// const upload = multer({ storage: storageM })
const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.get('/instructors', authMiddleware, getInstructors)
router.get('/instructors/:id', authMiddleware, getInstructor)
router.post('/instructors', authMiddleware, upload.single('file'), createInstructor)
// router.post('/instructors', authMiddleware, upload.single('file'), async (req, res) => {

//     try {
//         const ext = req.file.originalname.split('.').pop()

//         const storageRef = ref(storage, `files/${Date.now()}.${ext}`);

//         const metadata = {
//             contentType: req.file.mimetype,
//         };

//         const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

//         const downloadURL = await getDownloadURL(snapshot.ref);

//         return res.send({
//             message: 'file uploaded to firebase storage',
//             name: req.file.originalname,
//             type: req.file.mimetype,
//             downloadURL: downloadURL
//         })

//     } catch (error) {
//         console.log(req.file)

//         console.log(error)
//         return res.status(500).json({
//             message: 'Algo fue mal :('
//         })
//     }

// });
router.patch('/instructors/:id', authMiddleware, upload.single('file'), updateInstructor)
router.delete('/instructors/:id', authMiddleware, deleteInstructor)
router.patch('/instructors/activate/:id', authMiddleware, statusInstructor)

export default router