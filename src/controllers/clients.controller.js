import { pool } from "../db.js";

export const getClients = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM client WHERE fk_id_role_user = 2")
        res.json({ rows });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getClient = async (req, res) => {
    try {

        const [row] = await pool.query("SELECT * FROM client WHERE id = ?", [req.params.id])
        if (row.length <= 0) return res.status(404).json({
            message: "No se encontró el cliente"
        })
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const createClient = async (req, res) => {
    try {
        const { name, last_name, email, password, phone } = req.body
        const image = req.file.path
        const [rows] = await pool.query('INSERT INTO client (name,last_name,image,email,password,phone,fk_id_role_user) VALUES (?, ?, ?, ?, ?, ?, 2)', [name, last_name, image, email, password, phone])

        res.send({ rows, success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const deleteClient = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM client WHERE id = ?', [req.params.id]);

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

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params
        const { name, last_name, email, password, phone } = req.body
        const image = req.file !== undefined ? req.file.path : undefined
        console.log(req.body);
        console.log(req.file);
        const [result] = await pool.query(
            'UPDATE client SET name =?, last_name =?, image =IFNULL(?,image), email =?, password = IFNULL(?,password), phone=? WHERE id =?',
            [name, last_name, image, email, password, phone, id]
        )

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró el usuario"
        })

        res.send('Actualizado correctamente')
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const statusClient = async (req, res) => {
    try {

        const [user] = await pool.query('SELECT * FROM client WHERE id = ?', [req.params.id]);
        const state = user[0].active
        const [result] = await pool.query('UPDATE client SET active = ? WHERE id = ?', [!state, req.params.id]);

        if (result.affectedRows == 0) return res.status(404).json({
            message: "No se encontró el cliente"
        })

        res.send({ message: 'Actualizado correctamente', success: true })
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};
