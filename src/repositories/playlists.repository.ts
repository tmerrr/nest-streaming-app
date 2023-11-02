import { Playlist } from '../models/Playlist';
import db from '../clients/db.client';

class PlaylistNotFoundError extends Error {}

export class PlaylistsRepository {
  private client = db.getRepository(Playlist);

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
