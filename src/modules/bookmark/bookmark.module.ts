import { DatabaseModule } from '@/database';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { providers } from './bookmark.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [BookmarkController],
  providers: [...providers],
})
export class BookmarkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { }
}
