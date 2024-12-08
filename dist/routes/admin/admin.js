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
const nthOrder = 2;
router.post('/generate-discount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalOrders = parseInt((yield redis_1.default.get('totalOrders')) || '0');
    console.log(totalOrders);
    if ((totalOrders + 1) % nthOrder === 0) {
        const code = `DISCOUNT${totalOrders + 1}`;
        yield redis_1.default.set(`discount:${code}`, 'true');
        yield redis_1.default.rpush('discountCodes', code);
        res.status(200).json({ code });
    }
    else {
        res.status(400).json({ message: `Not eligible for a discount code.` });
    }
}));
router.get('/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = (yield redis_1.default.get('totalOrders')) || '0';
    const totalOrders = parseInt(orders);
    const discountCodes = yield redis_1.default.lrange('discountCodes', 0, -1);
    res.status(200).json({
        totalOrders,
        discountCodes,
        totalDiscountsGiven: discountCodes.length,
    });
}));
exports.default = router;
