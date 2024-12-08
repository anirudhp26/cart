import request from 'supertest';
import redis from '../services/redis';
import { app } from '../index';

interface Item {
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

beforeEach(async () => {
  await redis.flushall();
});

afterAll(() => {
  redis.quit();
});

describe('Cart API', () => {
  it('should add an item to the cart', async () => {
    const res = await request(app).post('/cart/add-item').send({
      userId: '1',
      item: { name: 'item1', price: 100, quantity: 1, currency: 'USD' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item added to cart');

    const cartItems = await redis.lrange('cart:1', 0, -1);
    expect(cartItems.length).toBe(1);
    expect(JSON.parse(cartItems[0]) as Item).toEqual({ name: 'item1', price: 100, quantity: 1, currency: 'USD' });
  });

  it('should checkout successfully without a discount code', async () => {
    await redis.rpush('cart:1', JSON.stringify({ name: 'item1', price: 100, quantity: 1, currency: 'USD' }));

    const res = await request(app).post('/cart/checkout').send({
      userId: '1',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Order placed successfully');
    expect(res.body.total).toBe(100);

    const cartItems = await redis.lrange('cart:1', 0, -1);
    expect(cartItems.length).toBe(0);
  });

  it('should apply a discount code during checkout', async () => {
    await redis.rpush('cart:1', JSON.stringify({ name: 'item1', price: 100, quantity: 1, currency: 'USD' }));
    await redis.set('discount:DISCOUNT5', 'true');

    const res = await request(app).post('/cart/checkout').send({
      userId: '1',
      discountCode: 'DISCOUNT5',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(90);
  });

  it('should fail checkout with an invalid discount code', async () => {
    await redis.rpush('cart:1', JSON.stringify({ name: 'item1', price: 100, quantity: 1, currency: 'USD' }));

    const res = await request(app).post('/cart/checkout').send({
      userId: '1',
      discountCode: 'INVALID',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid discount code');
    redis.del('cart:1');
  });
});
