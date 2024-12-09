"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const redis_1 = __importDefault(require("../../services/redis"));
router.post('/add-item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, item } = req.body;
    const cartKey = `cart:${userId}`;
    yield redis_1.default.rpush(cartKey, JSON.stringify(item));
    res.status(200).json({ message: 'Item added to cart' });
}));
router.post('/checkout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, discountCode } = req.body;
    const cartKey = `cart:${userId}`;
    const cartItems = yield redis_1.default.lrange(cartKey, 0, -1);
    if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }
    let total = cartItems.reduce((sum, item) => sum + parseFloat(JSON.parse(item).price), 0);
    if (discountCode) {
        const validCode = yield redis_1.default.get(`discount:${discountCode}`);
        if (validCode) {
            total *= 0.9;
            yield redis_1.default.del(`discount:${discountCode}`);
        }
        else {
            return res.status(400).json({ message: 'Invalid discount code' });
        }
    }
    yield redis_1.default.del(cartKey);
    yield redis_1.default.incr('totalOrders');
    res.status(200).json({ message: 'Order placed successfully', total });
}));
exports.default = router;
