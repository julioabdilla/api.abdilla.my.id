import { v4 as uuid } from 'uuid';

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { CacheModule } from 'src/cache';
import { OnRequestMiddleware } from 'src/common/middlewares/on_request.middleware';
import { DatabaseModule } from 'src/database';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: {
          paths: ['api_key', 'token', 'key', 'req.headers.authorization', 'password', 'authorization', 'signature', 'Authorization'],
          censor: '[***secret***]',
        },
        genReqId: (req: any) => {
          return req.headers.req_id || uuid();
        },
        autoLogging: false,
      },
    }),
    DatabaseModule,
    CacheModule,
    MessageModule,
    BookmarkModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OnRequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
