import express from 'express'
import { pool } from './db.js'
import usersRoutes from './routes/users.routes.js'
import { PORT } from './config.js'

const app = express()

app.use(express.json())

app.get('/ping', async (req, res) => {
    const result = await pool.query('SELECT 1+1')
    res.json(result)
});

app.use('/api', usersRoutes)
app.use((req, res) => {
    res.status(404).json({
        message: 'Pagina no encontrada'
    })
})

app.listen(PORT)
console.log('Server running on port', PORT)