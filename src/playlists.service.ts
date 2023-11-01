import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Playlist, PlaylistsRepository } from './playlists.repository';
import { SongsRepository } from './songs.repository';

export type CreatePlaylistData = {
  songIds: string[];
};

@Injectable()
export class PlaylistsService {
  private playlistsRepository = new PlaylistsRepository();

  private songsRepository = new SongsRepository();

  async createPlaylist(playlistData: CreatePlaylistData): Promise<Playlist> {
    const hasSongs = playlistData.songIds.length > 0;
    const playlist: Playlist = {
      id: randomUUID(),
      songIds: playlistData.songIds,
      ...(hasSongs && {
        currentSongId: playlistData.songIds[0],
        currentSongIndex: 0,
      }),
    };
    await this.playlistsRepository.save(playlist);
    return playlist;
  }

  listPlaylists(): Promise<Playlist[]> {
    return this.playlistsRepository.list();
  }

  async addSong(playlistId: string, songId: string): Promise<Playlist> {
    const [playlist, song] = await Promise.all([
      this.playlistsRepository.get(playlistId),
      this.songsRepository.get(songId),
    ]);
    if (!playlist) {
      throw new NotFoundException(`Playlist not found: ${playlistId}`);
    }
    if (!song) {
      throw new NotFoundException(`Song not found: ${songId}`);
    }
    playlist.songIds.push(songId);
    if (playlist.songIds.length === 1) {
      playlist.currentSongId = songId;
      playlist.currentSongIndex = 0;
    }
    await this.playlistsRepository.save(playlist);
    return playlist;
  }
}
