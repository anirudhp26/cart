import express from 'express';
import cors from 'cors';
import redis from './services/redis';
import { Request, Response } from 'express';
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['*'],
    credentials: true
}));

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});