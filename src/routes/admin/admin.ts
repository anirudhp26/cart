import express from 'express';
const router = express.Router();
import redis from '../../services/redis';

const nthOrder = 2;

router.post('/get-discount', async (req, res) => {
  const totalOrders = parseInt(await redis.get('totalOrders') || '0');
  if ((totalOrders + 1) % nthOrder === 0) {
    const code = `10POFF${totalOrders + 1}`;
    await redis.set(`discount:${code}`, 'true');
    await redis.rpush('discountCodes', code);
    res.status(200).json({ code });
  } else {
    res.status(400).json({ message: `Not eligible for a discount code.` });
  }
});

router.get('/order-stats', async (req, res) => {
  const orders = await redis.get('totalOrders') || '0';
  const totalOrders = parseInt(orders);
  const discountCodes = await redis.lrange('discountCodes', 0, -1);

  res.status(200).json({
    totalOrders,
    discountCodes,
    totalDiscountsGiven: discountCodes.length,
  });
});

export default router;
