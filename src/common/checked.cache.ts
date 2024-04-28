import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheChecked {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async checkCacheStored(cacheKey: string): Promise<boolean> {
    const isCached = await this.cacheManager.get(cacheKey);

    return !!isCached;
  }
}
