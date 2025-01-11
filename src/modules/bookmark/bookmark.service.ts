import { Inject, Injectable } from '@nestjs/common';

import { Bookmark as BookmarkModel } from './bookmark.model';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class BookmarkService {

  constructor(
    @Inject(BookmarkModel.REPOSITORY_NAME) private readonly bookmarkRepository: typeof BookmarkModel,
    @Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka
  ) { }

  public async getBookmark(page = 1, limit = 20): Promise<{total: number, data:BookmarkModel[]}> {
    const offset = (page - 1) * limit;
    const result = await this.bookmarkRepository.findAndCountAll({
      offset, limit
    });
    return { total: result.count, data: result.rows };
  }

  public async getOneBookmark(uuid: string): Promise<BookmarkModel> {
    return await this.bookmarkRepository.findOne({
      where: { uuid }
    });
  }

  public async addBookmark(data: any): Promise<BookmarkModel> {
    const bookmark = this.bookmarkRepository.build();
    bookmark.name = data.name;
    bookmark.description = data.description;
    bookmark.link = data.link;
    bookmark.tags = data.tags;
    await bookmark.save();
    if (data.link) {
      this.kafkaClient.emit('abdillamyid-bookmark-sync_thumbnail', { bookmarkId: bookmark.uuid, link: data.link });
    }
    return bookmark;
  }

  public async syncThumbnail(uuid: string): Promise<void> {
    const bookmark = await this.bookmarkRepository.findOne({ where: { uuid }, raw: true });
    if (bookmark) {
      this.kafkaClient.emit('abdillamyid-bookmark-sync_thumbnail', { bookmarkId: bookmark.uuid, link: bookmark.link });
    }
  }
}
