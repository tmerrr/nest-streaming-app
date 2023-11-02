import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PlaylistsRepository } from '../repositories/playlists.repository';
import { SongsRepository } from '../repositories/songs.repository';
import { Playlist, PlaylistProps } from '../models/Playlist';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly playlistsRepository: PlaylistsRepository,
    private readonly songsRepository: SongsRepository,
  ) {}

  async createPlaylist(playlistData: PlaylistProps): Promise<Playlist> {
    const playlist = Playlist.create(playlistData);
    await this.playlistsRepository.save(playlist);
    return playlist;
  }

  listPlaylists(): Promise<Playlist[]> {
    return this.playlistsRepository.list();
  }

  public getPlaylist(playlistId: string): Promise<Playlist> {
    return this.playlistsRepository.getOrFail(playlistId);
  }

  async addSong(playlistId: string, songId: string): Promise<Playlist> {
    const [playlist] = await Promise.all([
      this.playlistsRepository.getOrFail(playlistId),
      this.songsRepository.getOrFail(songId), // ensures song exists
    ]);
    playlist.addSong(songId);
    await this.playlistsRepository.save(playlist);
    return playlist;
  }

  async removeSong(playlistId: string, songId: string): Promise<Playlist> {
    const playlist = await this.playlistsRepository.getOrFail(playlistId);
    playlist.removeSong(songId);
    await this.playlistsRepository.save(playlist);
    return playlist;
  }

  public async shuffleAllSongs(): Promise<Playlist> {
    const songs = await this.songsRepository.list();
    const songIds = songs.map(({ id }) => id);
    const playlist = Playlist.create({
      name: `shuffled-${randomUUID()}`,
      songIds,
    }).shuffle();
    await this.playlistsRepository.save(playlist);
    return playlist;
  }

  public async incrementPlaylist(playlistId: string): Promise<Playlist> {
    const playlist = await this.playlistsRepository.getOrFail(playlistId);
    playlist.incrementCurrentSong();
    await this.playlistsRepository.save(playlist);
    return playlist;
  }
}
