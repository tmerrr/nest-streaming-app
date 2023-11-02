import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from '../services/songs.service';
import { PlaybackService } from '../services/playback.service';
import { PlaylistsService } from '../services/playlists.service';
import { Song, SongProps } from '../models/Song';

describe('SongsController', () => {
  let songsController: SongsController;
  let songsService: SongsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [SongsService, PlaylistsService, PlaybackService],
    }).compile();

    songsController = app.get<SongsController>(SongsController);
    songsService = app.get<SongsService>(SongsService);
  });

  describe('create', () => {
    it('should call the songs service correctly and return song data', async () => {
      const body: SongProps = {
        name: 'All My Life',
        artist: 'Foo Fighters',
      };
      const song: Song = Song.create(body);
      jest.spyOn(songsService, 'uploadSong').mockResolvedValueOnce(song);

      const file: Pick<Express.Multer.File, 'buffer'> = {
        buffer: Buffer.from([]),
      };
      const result = await songsController.create(file as any, body);
      expect(result).toEqual(song.toRaw());
      expect(songsService.uploadSong).toHaveBeenCalledTimes(1);
      expect(songsService.uploadSong).toHaveBeenCalledWith(file.buffer, body);
    });
  });
});
