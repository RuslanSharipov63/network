import express from "express";
import "dotenv/config";

const router = express.Router();


router.post('/', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      mode: "cors",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.TOKEN_DADATA}`,
      },
      body: JSON.stringify({ query, count: 5 }),
    });
    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка поиска адреса' });
  }
});

export default router;