import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import { RedisIoAdapter } from './adapters/redis.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  const redisIOAdapter = new RedisIoAdapter(app);
  await redisIOAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIOAdapter);
  //
  const port = 4040;
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}
bootstrap();
