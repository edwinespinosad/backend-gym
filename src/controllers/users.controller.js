import { pool } from "../db.js";

export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM user WHERE fk_id_role_user = 1")
        res.json({ rows });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getUser = async (req, res) => {
    try {

        const [row] = await pool.query("SELECT * FROM user WHERE id = ?", [req.params.id])
        if (row.length <= 0) return res.status(404).json({
            message: "No se encontró el usuario"
        })
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, last_name, email, password, phone, fk_id_role_user } = req.body

        const [rows] = await pool.query('INSERT INTO user (name,last_name,email,password,phone,fk_id_role_user) VALUES (?, ?, ?, ?, ?, ?)', [name, last_name, email, password, phone, fk_id_role_user])

        res.send({ rows })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const deleteUser = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM user WHERE id = ?', [req.params.id]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: "No se encontró el usuario"
        })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, last_name, email, password, phone } = req.body
        const [result] = await pool.query(
            'UPDATE user SET name =?, last_name =?, email =?, password = IFNULL(?,password), phone =? WHERE id =?', [name, last_name, email, password, phone, id]
        )

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró el usuario"
        })

        res.send('Actualizado correctamente')
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};




