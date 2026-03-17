import { Pool } from 'pg';
import 'dotenv/config'; // ← загружает .env в process.env

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10), // ← port должен быть числом!
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Опционально: настройки пула
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Лог ошибок подключения (очень полезно в проде)
pool.on('error', (err) => {
  console.error('Ошибка в пуле PostgreSQL:', err.message);
});

export default pool;



