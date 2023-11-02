import { Injectable, StreamableFile } from '@nestjs/common';
import { SongsService } from './songs.service';
import { PlaylistsService } from './playlists.service';

const createAudioStreamable = (b: Buffer) =>
  new StreamableFile(b, { type: 'audio/mpeg', length: b.byteLength });

@Injectable()
export class PlaybackService {
  constructor(
    private readonly songsService: SongsService,
    private readonly playlistsService: PlaylistsService,
  ) {}

  public async playSong(songId: string): Promise<StreamableFile> {
    const song = await this.songsService.getSongBufferById(songId);
    return createAudioStreamable(song);
  }

  public async playPlaylist(playlistId: string): Promise<StreamableFile> {
    const playlist = await this.playlistsService.getPlaylist(playlistId);
    // TODO: what to do if playlist is empty??
    if (!playlist.currentSongId) {
      return new StreamableFile(Buffer.from([]));
    }
    const song = await this.songsService.getSongBufferById(
      playlist.currentSongId,
    );
    return createAudioStreamable(song);
  }
}
