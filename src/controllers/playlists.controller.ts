import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { PlaylistsService } from '../services/playlists.service';
import { PlaybackService } from '../services/playback.service';
import { Playlist, PlaylistRaw, PlaylistProps } from '../models/Playlist';

@Controller('playlists')
export class PlaylistsController {
  constructor(
    private readonly playlistsService: PlaylistsService,
    private readonly playbackService: PlaybackService,
  ) {}

  @Post()
  create(@Body() body: PlaylistProps): Promise<Playlist> {
    return this.playlistsService.createPlaylist(body);
  }

  @Get()
  async list(): Promise<PlaylistRaw[]> {
    const playlists = await this.playlistsService.listPlaylists();
    return playlists.map((pl) => pl.toRaw());
  }

  @Post('shuffle')
  async shuffleAll(): Promise<PlaylistRaw> {
    const playlist = await this.playlistsService.shuffleAllSongs();
    return playlist.toRaw();
  }

  @Get(':playlistId/play')
  @Header('Accept-Ranges', 'bytes')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  play(@Param('playlistId') playlistId: string): Promise<StreamableFile> {
    return this.playbackService.playPlaylist(playlistId);
  }

  @Post(':playlistId/increment')
  async increment(
    @Param('playlistId') playlistId: string,
  ): Promise<PlaylistRaw> {
    const playlist = await this.playlistsService.incrementPlaylist(playlistId);
    return playlist.toRaw();
  }
}
