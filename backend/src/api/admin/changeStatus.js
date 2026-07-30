import express from 'express';
import pool from '../../db/connect.js';

const router = express.Router();


router.post('/', async (req, res) => {
    const {id, currentStatus} = req.body;


    try {
        const { rows } = await pool.query(
            `UPDATE services SET status=$1 WHERE id=$2 RETURNING id`, [currentStatus, id]
        )
        if (rows.length === 0) {
            return res.json({ success: false, message: "Изменить статус не удалось. Попробуйте еще раз" })
        }
        res.json({ success: true, message: "Статус записи изменен" })
    } catch (error) {
        console.log('Error: ошибка изменения статуса', error);
        res.json({ success: false, message: "Ошибка сервера!" })
    }
})


export default router;
