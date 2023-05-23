import { pool } from "../db.js";

export const getSuggestions = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM suggestions")
        res.json({ rows });
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};

export const createSuggestion = async (req, res) => {
    try {
        const { description } = req.body

        const [rows] = await pool.query('INSERT INTO suggestions (description) VALUES (?)', [description])

        res.send({ rows, success: true })
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};