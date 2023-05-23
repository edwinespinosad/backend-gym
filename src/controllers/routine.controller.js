import { pool } from "../db.js";

export const getRoutines = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM routine")
        res.json({ rows });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createRoutine = async (req, res) => {
    try {
        const { name, description } = req.body

        const [rows] = await pool.query('INSERT INTO routine (name, description) VALUES (?, ?)', [name, description])

        res.send({ rows, success: true })
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};

export const updateRoutine = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description } = req.body
        const [result] = await pool.query(
            'UPDATE routine SET name =?, description =? WHERE id =?', [name, description, id]
        )

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró la rutina"
        })

        res.send({ message: 'Actualizado correctamente', success: true })
    } catch (error) {
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};