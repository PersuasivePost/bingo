import { Module } from '@nestjs/common';
import { BingoEngineService } from './bingo-engine.service';

@Module({
  providers: [BingoEngineService],
  exports: [BingoEngineService],
})
export class BingoModule {}
