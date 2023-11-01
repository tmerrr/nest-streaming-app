import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common';
import {
  PlaylistsService,
  CreatePlaylistData,
} from '../services/playlists.service';
import { PlaybackService } from '../services/playback.service';
import { Playlist } from '../repositories/playlists.repository';

@Controller('playlists')
export class PlaylistsController {
  constructor(
    private readonly playlistsService: PlaylistsService,
    private readonly playbackService: PlaybackService,
  ) {}

  @Post()
  create(@Body() body: CreatePlaylistData): Promise<Playlist> {
    return this.playlistsService.createPlaylist(body);
  }

  @Get()
  list(): Promise<Playlist[]> {
    return this.playlistsService.listPlaylists();
  }

  @Post('shuffle')
  shuffleAll(): Promise<Playlist> {
    return this.playlistsService.shuffleAllSongs();
  }

  @Get(':playlistId/play')
  @Header('Accept-Ranges', 'bytes')
  play(@Param('playlistId') playlistId: string): Promise<StreamableFile> {
    return this.playbackService.playPlaylist(playlistId);
  }
}
