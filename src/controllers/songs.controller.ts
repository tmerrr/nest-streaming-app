import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SongsService } from '../services/songs.service';
import { Song, SongProps, SongRaw } from '../models/Song';
import { PlaybackService } from '../services/playback.service';

type UploadReqBody = SongProps;

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly playbackService: PlaybackService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadReqBody,
  ): Promise<Song> {
    return this.songsService.uploadSong(file.buffer, body);
  }

  @Get()
  async listSongs(): Promise<SongRaw[]> {
    const songs = await this.songsService.listSongs();
    return songs.map((s) => s.toRaw());
  }

  @Get(':songId/play')
  // res header not needed when specifying type on StreamableFile
  // @Header('Content-Type', 'audio/mpeg')
  // this header allows timer to be dragged on playback
  @Header('Accept-Ranges', 'bytes')
  async playSong(@Param('songId') songId: string): Promise<StreamableFile> {
    return this.playbackService.playSong(songId);
  }

  @Get('test')
  @Header('Accept-Ranges', 'bytes')
  async playStockSong(): Promise<StreamableFile> {
    return this.playbackService.playSong(
      '9dc5e36c-312a-478e-8ea5-649bc57036b5',
    );
  }
}
