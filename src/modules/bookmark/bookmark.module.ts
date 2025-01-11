import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { providers } from './bookmark.provider';
import { MessageModule } from '@/message/message.module';

@Module({
  imports: [
    DatabaseModule,
    MessageModule
  ],
  controllers: [BookmarkController],
  providers: [...providers],
})
export class BookmarkModule { }
