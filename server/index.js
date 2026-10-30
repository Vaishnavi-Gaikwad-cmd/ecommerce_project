import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import dalleRoutes from './routes/dalle.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "50mb" }))

app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/orders', orderRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from DALLE" })
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server has started on port ${port}`))
