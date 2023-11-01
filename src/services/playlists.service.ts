import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { shuffle } from 'lodash';
import {
  Playlist,
  PlaylistsRepository,
} from '../repositories/playlists.repository';
import { SongsRepository } from '../repositories/songs.repository';

export type CreatePlaylistData = {
  name: string;
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
      name: playlistData.name,
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

  public getPlaylist(playlistId: string): Promise<Playlist> {
    return this.playlistsRepository.getStrict(playlistId);
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

  public async shuffleAllSongs(): Promise<Playlist> {
    const songs = await this.songsRepository.list();
    const songIds = songs.map(({ id }) => id);
    const id = randomUUID();
    const playlist: Playlist = {
      id,
      name: `shuffle-${id}`,
      songIds: shuffle(songIds),
      ...(songIds.length > 0 && {
        currentSongId: songIds[0],
        currentSongIndex: 0,
      }),
    };
    await this.playlistsRepository.save(playlist);
    return playlist;
  }
}
