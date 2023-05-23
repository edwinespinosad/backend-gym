import { pool } from "../db.js";

export const getEarnings = async (req, res) => {
    try {
        const membershipPurchaseQuery = 'SELECT SUM(price) AS total FROM membership_purchase';
        const [membershipPurchaseRows] = await pool.query(membershipPurchaseQuery);
        const membershipPurchaseTotal = membershipPurchaseRows[0].total || 0;

        const expenseQuery = 'SELECT SUM(cost) AS total FROM expense';
        const [expenseRows] = await pool.query(expenseQuery);
        const expenseTotal = expenseRows[0].total || 0;

        const earnings = new Intl.NumberFormat().format(membershipPurchaseTotal - expenseTotal);

        res.json({ earnings });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salió mal :('
        });
    }
};


export const getIncomes = async (req, res) => {
    try {
        let query = "";
        switch (req.query.periodo) {
            case 'semanal':
                query = "SELECT DATE_FORMAT(created_at, '%Y-%u') AS week, SUM(price) AS total FROM membership_purchase WHERE YEAR(created_at) = YEAR(NOW()) GROUP BY week ORDER BY week ASC";
                break;
            case 'mensual':
                query = `
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(price) AS total 
                FROM membership_purchase 
                WHERE YEAR(created_at) = YEAR(NOW()) 
                GROUP BY month 
                ORDER BY FIELD(month, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')`;
                break;
            case 'anual':
                query = `SELECT YEAR(created_at) AS year, SUM(price) AS total 
                FROM membership_purchase 
                GROUP BY year 
                ORDER BY year ASC
                `;
                break;
        }

        const [rows] = await pool.query(query);

        const formattedRows = rows.map(row => {
            const formattedTotal = new Intl.NumberFormat().format(row.total);
            return { ...row, total: formattedTotal };
        });

        res.json({ incomes: formattedRows });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo fue mal :('
        })
    }
};

export const getExpenses = async (req, res) => {
    try {
        let query = "";
        switch (req.query.periodo) {
            case 'semanal':
                query = `
                SELECT WEEK(timestamps) AS week, SUM(cost) AS total
                FROM expense
                WHERE YEAR(timestamps) = YEAR(NOW())
                GROUP BY week
                ORDER BY week ASC
                `;
                break;
            case 'mensual':
                query = `
                SELECT MONTH(timestamps) AS month, SUM(cost) AS total
                FROM expense
                WHERE YEAR(timestamps) = YEAR(NOW())
                GROUP BY month
                ORDER BY month ASC
                `;
                break;
            case 'anual':
                query = `
                SELECT YEAR(timestamps) AS year, SUM(cost) AS total
                FROM expense
                GROUP BY year
                ORDER BY year ASC
                `;
                break;
        }

        const [rows] = await pool.query(query);

        const formattedRows = rows.map(row => {
            const formattedTotal = new Intl.NumberFormat().format(row.total);
            return { ...row, total: formattedTotal };
        });

        res.json({ expenses: formattedRows });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salió mal :('
        });
    }
};

export const getMembershipSales = async (req, res) => {
    try {
        let query = "";
        const { periodo } = req.query;

        switch (periodo) {
            case "semanal":
                query = "SELECT COUNT(*) AS ventas, WEEK(created_at) AS periodo FROM membership_purchase WHERE YEAR(created_at) = YEAR(NOW()) GROUP BY WEEK(created_at) ";
                break;
            case "mensual":
                query = "SELECT COUNT(*) AS ventas, MONTH(created_at) AS periodo FROM membership_purchase WHERE YEAR(created_at) = YEAR(NOW()) GROUP BY MONTH(created_at) ";
                break;
            case "anual":
                query = "SELECT COUNT(*) AS ventas, YEAR(created_at) AS periodo FROM membership_purchase GROUP BY YEAR(created_at) ";
                break;
        }

        const [rows] = await pool.query(query);
        res.json({ membershipSales: rows });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Algo fue mal :("
        });
    }
};

export const getNewClients = async (req, res) => {
    try {
        let query = ""
        const { periodo } = req.query;
        // if (periodo) {
        if (periodo === "semanal") {
            query = "SELECT COUNT(*) as count, DATE(created_at) as day FROM client WHERE YEARWEEK(created_at) = YEARWEEK(NOW()) GROUP BY DATE(created_at)"
        } else if (periodo === "mensual") {
            query = "SELECT COUNT(*) AS count, MONTH(created_at) AS month, YEAR(created_at) AS year FROM client WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR) GROUP BY YEAR(created_at), MONTH(created_at);"
        } else if (periodo === "anual") {
            query = "SELECT COUNT(*) as count, YEAR(created_at) as year FROM client WHERE YEAR(created_at) = YEAR(NOW()) GROUP BY YEAR(created_at)";
        }

        const [rows] = await pool.query(query);

        res.json({ newClients: rows });
    } catch (error) {
        console.log()
        return res.status(500).json({
            message: "Algo fue mal :(",
            error
        });
    }
};