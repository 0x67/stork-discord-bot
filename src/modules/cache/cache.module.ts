import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as ChacheManagerModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [ChacheManagerModule.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
