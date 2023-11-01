import { Module } from '@nestjs/common';
import { SongsController } from './controllers/songs.controller';
import { SongsService } from './services/songs.service';

@Module({
  imports: [],
  controllers: [SongsController],
  providers: [SongsService],
})
export class AppModule {}
