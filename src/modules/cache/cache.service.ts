import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

const ONE_SECOND = 1000; // 1 second in milliseconds
const ONE_MINUTE = ONE_SECOND * 60;

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly chace: Cache) {}

  async get<T>(key: string) {
    return await this.chace.get<T>(key);
  }

  /**
   *
   * @param key key to set
   * @param value value to set
   * @param ttl time to live in milliseconds (default 10 minutes)
   */
  async set(key: string, value: unknown, ttl = 10 * ONE_MINUTE) {
    await this.chace.set(key, value, ttl);
  }
}
