import { pool } from "../db.js";

export const getExpenses = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM expense")

        const formattedRows = rows.map(row => {
            const formattedTotal = new Intl.NumberFormat().format(row.cost);
            return { ...row, total: '$' + formattedTotal };
        });
        res.json({ rows: formattedRows });
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};

export const createExpense = async (req, res) => {
    try {
        const { description, cost } = req.body

        const [rows] = await pool.query('INSERT INTO expense (description,cost) VALUES (?, ?)', [description, cost])

        res.send({ rows, success: true })
    } catch (error) {
        console.log(error)
        return res.send({
            message: 'Algo fue mal :('
        })
    }
};


