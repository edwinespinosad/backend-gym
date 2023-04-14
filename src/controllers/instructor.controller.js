import { pool } from "../db.js";

export const getInstructors = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM instructor")
        res.json({ rows });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getInstructor = async (req, res) => {
    try {

        const [row] = await pool.query("SELECT * FROM instructor WHERE id = ?", [req.params.id])
        if (row.length <= 0) return res.status(404).json({
            message: "No se encontró el instructor"
        })
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createInstructor = async (req, res) => {
    try {
        const { name, last_name, email, phone } = req.body
        const { filename } = req.file

        const [rows] = await pool.query(
            'INSERT INTO instructor (image,name,last_name,email,phone) VALUES (?, ?, ?, ?, ?)',
            [`uploads/${filename}`, name, last_name, email, phone]
        )

        res.send({ rows, success: true })

    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const deleteInstructor = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM instructor WHERE id = ?', [req.params.id]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: "No se encontró el instructor"
        })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params
        const { name, last_name, email, phone, change_image } = req.body
        
        if (change_image === 'true') {
            const { filename } = req.file
            
            const [result] = await pool.query(
                'UPDATE instructor SET image =IFNULL(?,image), name =?, last_name =?, email =?, phone=? WHERE id =?',
                [`uploads/${filename}`, name, last_name, email, phone, id]
            )

            if (result.affectedRows == 0) return res.status(404).json({
                message: "No se encontró el instructor"
            })

            res.send({ message: 'Actualizado correctamente', success: true })
        } else {
            const [result] = await pool.query(
                'UPDATE instructor SET name =?, last_name =?, email =?, phone=? WHERE id =?',
                [name, last_name, email, phone, id]
            )

            if (result.affectedRows == 0) return res.status(404).json({
                message: "No se encontró el instructor"
            })

            res.send({ message: 'Actualizado correctamente', success: true })
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const statusInstructor = async (req, res) => {
    try {

        const [user] = await pool.query('SELECT * FROM instructor WHERE id = ?', [req.params.id]);
        const state = user[0].active
        const [result] = await pool.query('UPDATE instructor SET active = ? WHERE id = ?', [!state, req.params.id]);

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró el instructor"
        })

        res.send({ message: 'Actualizado correctamente', success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};
