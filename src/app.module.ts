import { Module } from '@nestjs/common';
import { PlaylistsController } from './controllers/playlists.controller';
import { PlaylistsService } from './services/playlists.service';
import { SongsController } from './controllers/songs.controller';
import { SongsService } from './services/songs.service';
import { PlaybackService } from './services/playback.service';

@Module({
  imports: [],
  controllers: [SongsController, PlaylistsController],
  providers: [SongsService, PlaylistsService, PlaybackService],
})
export class AppModule {}
