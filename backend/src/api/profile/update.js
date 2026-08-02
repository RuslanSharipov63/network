import express from 'express';
import pool from './../../db/connect.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { id, username, email, address } = req.body
    if (!id) {
        res.json({ success: false, message: "Не найден id" })
        return;
    }
    try {

        const sql = `UPDATE users SET username = $1, email = $2, address $3, WHERE id = $4 RETURNING id, email, address, username, avatar, role`;
        const values = [username, email, address];
        const dbResult = await pool.query(sql, values);
        const result = dbResult.rows[0];

        res.json({ success: true, message: "Профиль обновлен", result, status: "fulfilled" })
    }
    catch (error) {
        console.log('Ошибка обновления профиля', error)
        res.json({ success: false, message: "Ошибка обновления профиля" })
    }

})

export default router;
