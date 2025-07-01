import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { BingoModule } from './bingo/bingo.module';

@Module({
  imports: [GameModule, BingoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
