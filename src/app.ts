import express from 'express';
import cors from 'cors';
import cartRoutes from './routes/cart/cart';
import adminRoutes from './routes/admin/admin';
import { Request, Response } from 'express';
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['*'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

function checkAuth(req: Request, res: Response, next: any) {
    if (req.headers.authorization === 'admin') {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

app.use('/cart', cartRoutes);
app.use('/admin', checkAuth, adminRoutes);

export { app };