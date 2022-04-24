import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';

@Module({
  // 特定のEntityのみimportします
  imports: [TypeOrmModule.forFeature([Cat])],
  // モジュール外でも利用できるようにします
  exports: [TypeOrmModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
