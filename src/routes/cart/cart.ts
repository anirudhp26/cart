import express from 'express';
const router = express.Router();
import redis from '../../services/redis';

router.post('/add-item', async (req, res) => {
  const { userId, item } = req.body;
  const cartKey = `cart:${userId}`;
  await redis.rpush(cartKey, JSON.stringify(item));
  res.status(200).json({ message: 'Item added to cart' });
});

router.post('/checkout', async (req, res): Promise<any> => {
  const { userId, discountCode } = req.body;
  const cartKey = `cart:${userId}`;
  const cartItems = await redis.lrange(cartKey, 0, -1);

  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let total = cartItems.reduce((sum: number, item: string) => sum + parseFloat(JSON.parse(item).price), 0);

  if (discountCode) {
    const validCode = await redis.get(`discount:${discountCode}`);
    if (validCode) {
      total *= 0.9;
      await redis.del(`discount:${discountCode}`);
    } else {
      return res.status(400).json({ message: 'Invalid discount code' });
    }
  }

  await redis.del(cartKey);
  await redis.incr('totalOrders');

  res.status(200).json({ message: 'Order placed successfully', total });
});

export default router;