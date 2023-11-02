import { Inject, Injectable } from '@nestjs/common';
import { Playlist } from '../models/Playlist';
import { DataSource, Repository } from 'typeorm';

class PlaylistNotFoundError extends Error {}

@Injectable()
export class PlaylistsRepository {
  private readonly client: Repository<Playlist>;

  constructor(@Inject('DataSource') dataSource: DataSource) {
    this.client = dataSource.getRepository(Playlist);
  }

  // this function acts as an upsert, so will overwrite data if the key already exists
  public async save(playlist: Playlist): Promise<void> {
    await this.client.save(playlist);
  }

  public async get(playlistId: string): Promise<Playlist | null> {
    return this.client.findOneBy({ id: playlistId });
  }

  public async getOrFail(playlistId: string): Promise<Playlist> {
    const playlist = await this.get(playlistId);
    if (!playlist) {
      throw new PlaylistNotFoundError(`Playlist not found: ${playlistId}`);
    }
    return playlist;
  }

  public async list(): Promise<Playlist[]> {
    return this.client.find();
  }
}
