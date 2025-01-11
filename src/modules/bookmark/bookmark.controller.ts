import * as querystring from 'querystring';

import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller('/bookmark')
export class BookmarkController {
  constructor(
    private readonly bookmarkService: BookmarkService,
  ) {}

  @Get()
  async getAll(@Res({ passthrough: true }) res: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.bookmarkService.getBookmark(page, limit);
    res.set('X-Total-Count', result.total);
    res.set('X-Current-Page', page);
    res.set('X-Total-Page', Math.ceil(result.total / limit));
    res.set('X-Per-Page', limit);
    return result.data;
  }

  @Post()
  add(@Body() body: any) {
    return this.bookmarkService.addBookmark(body);
  }

  @Get('/:uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.bookmarkService.getOneBookmark(uuid);
  }

  @Patch('/:uuid/sync-thumbnail')
  syncThumbnail (@Param('uuid') uuid: string) {
    return this.bookmarkService.syncThumbnail(uuid);
  }
}
