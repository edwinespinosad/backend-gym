import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { pool } from "../db.js";
import config from '../config/firebase.config.js';
import { initializeApp } from "firebase/app";

initializeApp(config.firebaseConfig)

const storage = getStorage();

export const getMeals = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM meal")
        res.json({ rows });
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};

export const createMeal = async (req, res) => {
    try {
        // Upload to Firebase
        const ext = req.file.originalname.split('.').pop()

        const storageRef = ref(storage, `files/${Date.now()}.${ext}`);

        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref);

        const { name, meal_preparation } = req.body

        const [rows] = await pool.query('INSERT INTO meal (name, meal_preparation, image) VALUES (?, ?, ?)', [name, meal_preparation, downloadURL])

        res.send({ rows, success: true })
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};

export const updateMeal = async (req, res) => {
    try {
        const { id } = req.params
        const { name, meal_preparation, change_image } = req.body

        if (change_image === 'true') {
            const ext = req.file.originalname.split('.').pop()

            const storageRef = ref(storage, `files/meal/${Date.now()}.${ext}`);

            const metadata = {
                contentType: req.file.mimetype,
            };

            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

            const downloadURL = await getDownloadURL(snapshot.ref);

            const [result] = await pool.query(
                'UPDATE meal SET image =IFNULL(?,image), name =?, meal_preparation =? WHERE id =?',
                [downloadURL, name, meal_preparation, id]
            )

            if (result.affectedRows == 0) return res.status(404).json({
                message: "No se encontró la comida"
            })

            res.send({ message: 'Actualizado correctamente', success: true })
        } else {
            const [result] = await pool.query(
                'UPDATE meal SET name =?, meal_preparation =? WHERE id =?', [name, meal_preparation, id]
            )

            if (result.affectedRows == 0) return res.status(404).json({
                message: "No se encontró la comida"
            })

            res.send({ message: 'Actualizado correctamente', success: true })
        }
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};