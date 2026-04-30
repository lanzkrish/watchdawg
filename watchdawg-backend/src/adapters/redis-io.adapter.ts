/** @format */

import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor?: ReturnType<typeof createAdapter>; // ✅ FIX

  constructor(private app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis() {
    const pubClient = createClient({
      url: 'redis://localhost:6379',
    });

    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.error('❌ Redis Pub Error:', err));

    subClient.on('error', (err) => console.error('❌ Redis Sub Error:', err));

    await pubClient.connect();
    await subClient.connect();

    console.log('🟢 Redis connected');

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);

    /* ✅ SAFE CHECK */
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
      console.log('⚡ Redis adapter attached');
    } else {
      console.warn('⚠️ Redis adapter not initialized');
    }

    return server;
  }
}
