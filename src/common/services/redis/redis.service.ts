import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { Types } from 'mongoose';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.getOrThrow<string>('REDIS_URL'),
    });

    this.handleConnection();
  }

  // =========================
  // Redis Connection
  // =========================

  private handleConnection() {
    this.client.on('connect', () => {
      console.log('Redis connecting...');
    });

    this.client.on('ready', () => {
      console.log('Redis is ready');
    });

    this.client.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });

    this.client.on('error', (error: Error) => {
      console.error(`Redis connection error: ${error.message}`);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
      console.log('Redis connection closed');
    }
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log('Connected to Redis');
    }
  }

  // =========================
  // General Redis Operations
  // =========================

  async set({
    key,
    value,
    ttl,
  }: {
    key: string;
    value: unknown;
    ttl?: number;
  }): Promise<string | null> {
    const data =
      typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value);

    if (ttl) {
      return this.client.set(key, data, {
        EX: ttl,
      });
    }

    return this.client.set(key, data);
  }

  async get(key: string): Promise<unknown> {
    const data = await this.client.get(key);

    if (data === null) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    return this.client.mGet(keys);
  }

  async keys(prefix: string): Promise<string[]> {
    return this.client.keys(`${prefix}*`);
  }

  // =========================
  // Revoke Token
  // =========================

  createRevokeKey({
    userId,
    token,
  }: {
    userId: Types.ObjectId | string;
    token: string;
  }): string {
    return `revokeToken::${userId.toString()}::${token}`;
  }

  // =========================
  // Socket.IO
  // =========================

  socketKey(userId: Types.ObjectId | string): string {
    return `user:sockets:${userId.toString()}`;
  }

  async addSocket(
    userId: Types.ObjectId | string,
    socketId: string,
  ): Promise<number> {
    return this.client.sAdd(this.socketKey(userId), socketId);
  }

  async removeSocket(
    userId: Types.ObjectId | string,
    socketId: string,
  ): Promise<number> {
    return this.client.sRem(this.socketKey(userId), socketId);
  }

  async getSockets(userId: Types.ObjectId | string): Promise<string[]> {
    return this.client.sMembers(this.socketKey(userId));
  }

  async hasSockets(userId: Types.ObjectId | string): Promise<number> {
    return this.client.sCard(this.socketKey(userId));
  }

  async removeUser(userId: Types.ObjectId | string): Promise<number> {
    return this.client.del(this.socketKey(userId));
  }
}
