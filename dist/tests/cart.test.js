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
const supertest_1 = __importDefault(require("supertest"));
const redis_1 = __importDefault(require("../services/redis"));
const app_1 = require("../app");
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.default.flushall();
}));
afterAll(() => {
    redis_1.default.quit();
});
describe('Cart API', () => {
    it('should add an item to the cart', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post('/cart/add-item').send({
            userId: '1',
            item: { name: 'item1', price: 100, quantity: 1, currency: 'USD' },
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Item added to cart');
        const cartItems = yield redis_1.default.lrange('cart:1', 0, -1);
        expect(cartItems.length).toBe(1);
        expect(JSON.parse(cartItems[0])).toEqual({ name: 'item1', price: 100, quantity: 1, currency: 'USD' });
    }));
    it('should checkout successfully without a discount code', () => __awaiter(void 0, void 0, void 0, function* () {
        yield redis_1.default.rpush('cart:1', JSON.stringify({ name: 'item1', price: 100, quantity: 1, currency: 'USD' }));
        const res = yield (0, supertest_1.default)(app_1.app).post('/cart/checkout').send({
            userId: '1',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Order placed successfully');
        expect(res.body.total).toBe(100);
        const cartItems = yield redis_1.default.lrange('cart:1', 0, -1);
        expect(cartItems.length).toBe(0);
    }));
    it('should apply a discount code during checkout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield redis_1.default.rpush('cart:1', JSON.stringify({ name: 'item1', price: 100, quantity: 1, currency: 'USD' }));
        yield redis_1.default.set('discount:DISCOUNT5', 'true');
        const res = yield (0, supertest_1.default)(app_1.app).post('/cart/checkout').send({
            userId: '1',
            discountCode: 'DISCOUNT5',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.total).toBe(90);
    }));
    it('should fail checkout with an invalid discount code', () => __awaiter(void 0, void 0, void 0, function* () {
        yield redis_1.default.rpush('cart:1', JSON.stringify({ name: 'item1', price: 100, quantity: 1, currency: 'USD' }));
        const res = yield (0, supertest_1.default)(app_1.app).post('/cart/checkout').send({
            userId: '1',
            discountCode: 'INVALID',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid discount code');
        redis_1.default.del('cart:1');
    }));
});
