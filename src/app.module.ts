import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { MessageService } from './message/message.service';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    MessageModule,
    WsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080/123213',
      realm: 'Master',
      clientId: 'master-realm',
      secret: 'fTeWujWGWc2zzrY3D9wMARNcUR0ZiD7E',
    }),
    // KeycloakConnectModule.register({
    //   authServerUrl: 'http://10.11.30.45:8080/auth',
    //   realm: 'FINVIET',
    //   clientId: 'eco-loyalty',
    //   secret: 'c1a22f9c-38a6-46b1-a44c-6ddbd26b596b',
    // }),
  ],
  controllers: [AppController, MessageController],
  providers: [
    AppService,
    MessageService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],
})
export class AppModule {}
