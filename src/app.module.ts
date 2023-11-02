import { Module } from '@nestjs/common';
import { PlaylistsController } from './controllers/playlists.controller';
import { PlaylistsService } from './services/playlists.service';
import { SongsController } from './controllers/songs.controller';
import { SongsService } from './services/songs.service';
import { PlaybackService } from './services/playback.service';
import { redisClient } from './clients/redis.client';
import { AwsS3Client } from './clients/s3.client';
import { db } from './clients/db.client';
import { SongsRepository } from './repositories/songs.repository';
import { PlaylistsRepository } from './repositories/playlists.repository';

@Module({
  imports: [],
  controllers: [SongsController, PlaylistsController],
  providers: [
    // Clients:
    { provide: 'RedisClient', useValue: redisClient },
    { provide: 'DataSource', useValue: db },
    AwsS3Client,
    // Repositories
    SongsRepository,
    PlaylistsRepository,
    // Services
    SongsService,
    PlaylistsService,
    PlaybackService,
  ],
})
export class AppModule {}
