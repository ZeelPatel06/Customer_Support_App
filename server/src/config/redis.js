import { createClient } from "redis";
import config from "./config.js";

const redisClient = createClient({
  url: config.REDIS_URI,
  socket: {
    // 1. Send TCP keep-alive packets every 10 seconds to keep idle connections open
    keepAlive: 10000,
    
    // 2. Timeout connection attempts after 10 seconds instead of hanging
    connectTimeout: 10000,

    // 3. Enable TLS if your URL starts with rediss:// (Required by AWS ElastiCache, Upstash, Redis Cloud)
    tls: config.REDIS_URL?.startsWith("rediss://") ? true : undefined,

    // 4. Exponential backoff retry strategy when network connections drop
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis: Max reconnect retries reached.");
        return new Error("Redis connection lost");
      }
      // Delay reconnection attempts: 50ms, 100ms, 150ms... up to 3000ms max
      return Math.min(retries * 50, 3000);
    },
  },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("Redis Client Connecting..."));
redisClient.on("ready", () => console.log("Redis Client Ready & Connected!"));
redisClient.on("reconnecting", () => console.warn("Redis Client Reconnecting..."));

await redisClient.connect();

export default redisClient;