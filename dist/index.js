"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cart_1 = __importDefault(require("./routes/cart/cart"));
const admin_1 = __importDefault(require("./routes/admin/admin"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['*'],
    credentials: true
}));
const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
function checkAuth(req, res, next) {
    if (req.headers.authorization === 'admin') {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
app.use('/cart', cart_1.default);
app.use('/admin', checkAuth, admin_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
