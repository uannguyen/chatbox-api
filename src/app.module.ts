import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsService } from './ws/ws.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MessageModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, MessageController],
  providers: [AppService, WsService, MessageService],
})
export class AppModule {}
