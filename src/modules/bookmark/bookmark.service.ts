import { Inject, Injectable } from '@nestjs/common';

import { Bookmark as BookmarkModel } from './bookmark.model';

@Injectable()
export class BookmarkService {

  constructor(
    @Inject(BookmarkModel.REPOSITORY_NAME) private readonly bookmarkRepository: typeof BookmarkModel
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
    return bookmark;
  }
}
