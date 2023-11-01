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
import { SongsService } from '../services/songs.service';
import { Song } from '../repositories/songs.repository';
import { FileInterceptor } from '@nestjs/platform-express';

type UploadReqBody = Omit<Song, 'id'>;

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadReqBody,
  ): Promise<Song> {
    return this.songsService.uploadSong(file.buffer, body);
  }

  @Get()
  async listSongs(): Promise<Song[]> {
    return this.songsService.listSongs();
  }

  @Get(':songId/play')
  @Header('Content-Type', 'audio/mpeg')
  async playSong(@Param('songId') songId: string): Promise<StreamableFile> {
    const songBuffer = await this.songsService.getSongBufferById(songId);
    return new StreamableFile(songBuffer);
  }

  // "9dc5e36c-312a-478e-8ea5-649bc57036b5", # do you like it - our lady peace
  @Get('test')
  @Header('Content-Type', 'audio/mpeg')
  // async playStockSong(@Res() res: Response) { // Response type from express
  async playStockSong(): Promise<StreamableFile> {
    const songBuffer = await this.songsService.getSongBufferById(
      '9dc5e36c-312a-478e-8ea5-649bc57036b5',
    );
    // songBuffer.pipe(res);
    return new StreamableFile(songBuffer);
  }
}
