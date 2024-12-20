import Redis from "ioredis";
require("dotenv").config();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}
const redis = new Redis(redisUrl);

export default redis;