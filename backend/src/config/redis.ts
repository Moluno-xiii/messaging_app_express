import { createClient } from "redis";

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => {
  console.error("Redis client error", err);
});

const connectRedis = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect redis client", err);
  }
};

connectRedis();

export { client as redisClient };
