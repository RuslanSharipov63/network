import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from 'cookie-parser'; 

import registerRouter from "./api/register.js";
import loginRouter from "./api/login.js";
import meRouter from './api/me.js'
import logoutRouter from './api/logout.js'
import serviceRouter from './api/service/index.js'
import suggestAddressRouter from './api/suggest_address.js'

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
// CORS: разрешаем запросы с фронта (порт 3000)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/register', registerRouter)
app.use('/api/login', loginRouter)
app.use('/api/me', meRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/service', serviceRouter)
app.use('/api/suggest_address', suggestAddressRouter)
// 6. Запуск сервера
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Express сервер запущен на http://localhost:${PORT}`);

});
