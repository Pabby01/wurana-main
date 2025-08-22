import Redis from 'ioredis';
import config from './config.js';
import { logError, logInfo } from './logger.js';

class RedisClient {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  async connect() {
    try {
      this.client = new Redis({
        host: config.redis?.host || 'localhost',
        port: config.redis?.port || 6379,
        password: config.redis?.password,
        db: config.redis?.db || 0,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      // Handle Redis events
      this.client.on('connect', () => {
        logInfo('Redis client connected');
      });

      this.client.on('ready', () => {
        this.isReady = true;
        logInfo('Redis client ready');
      });

      this.client.on('error', (err) => {
        logError('Redis client error:', err);
      });

      this.client.on('close', () => {
        this.isReady = false;
        logInfo('Redis client closed');
      });

      this.client.on('reconnecting', () => {
        logInfo('Redis client reconnecting');
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      logError('Error connecting to Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isReady = false;
      logInfo('Redis client disconnected');
    }
  }

  // Cache methods
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logError('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, expireSeconds = 3600) {
    try {
      await this.client.set(
        key,
        JSON.stringify(value),
        'EX',
        expireSeconds
      );
      return true;
    } catch (error) {
      logError('Redis set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logError('Redis del error:', error);
      return false;
    }
  }

  // Session methods
  async getSession(sessionId) {
    return this.get(`session:${sessionId}`);
  }

  async setSession(sessionId, data, expireSeconds = 86400) {
    return this.set(`session:${sessionId}`, data, expireSeconds);
  }

  async deleteSession(sessionId) {
    return this.del(`session:${sessionId}`);
  }

  // Rate limiting methods
  async incrementRateLimit(key, expireSeconds = 60) {
    const multi = this.client.multi();
    multi.incr(key);
    multi.expire(key, expireSeconds);
    
    try {
      const results = await multi.exec();
      return results[0][1]; // Return the incremented value
    } catch (error) {
      logError('Redis rate limit error:', error);
      return 0;
    }
  }

  // Cache invalidation methods
  async invalidatePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      logError('Redis pattern invalidation error:', error);
      return false;
    }
  }

  // Pub/Sub methods for real-time features
  async publish(channel, message) {
    try {
      await this.client.publish(channel, JSON.stringify(message));
      return true;
    } catch (error) {
      logError('Redis publish error:', error);
      return false;
    }
  }

  async subscribe(channel, callback) {
    try {
      const subscriber = this.client.duplicate();
      await subscriber.subscribe(channel);
      
      subscriber.on('message', (ch, message) => {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          logError('Redis message parsing error:', error);
        }
      });

      return subscriber;
    } catch (error) {
      logError('Redis subscribe error:', error);
      return null;
    }
  }
}

// Create and export Redis instance
const redisClient = new RedisClient();
export default redisClient;