import { redisClient } from '../clients/redis.client';

export type Playlist = {
  id: string;
  name: string;
  songIds: string[];
  currentSongId?: string;
  currentSongIndex?: number;
};

class PlaylistNotFoundError extends Error {}

export class PlaylistsRepository {
  private client = redisClient;

  private keyPrefix = 'playlist';

  // this function acts as an upsert, so will overwrite data if the key already exists
  public async save(playlist: Playlist): Promise<void> {
    await this.client.set(
      `${this.keyPrefix}:${playlist.id}`,
      JSON.stringify(playlist),
    );
  }

  public async get(playlistId: string): Promise<Playlist | null> {
    const playlistData = await this.client.get(
      `${this.keyPrefix}:${playlistId}`,
    );
    if (playlistData) {
      const playlist = JSON.parse(playlistData);
      return {
        ...playlist,
        id: playlistId,
      };
    }
    return null;
  }

  public async getOrFail(playlistId: string): Promise<Playlist> {
    const playlist = await this.get(playlistId);
    if (!playlist) {
      throw new PlaylistNotFoundError(`Playlist not found: ${playlistId}`);
    }
    return playlist;
  }

  public async list(): Promise<Playlist[]> {
    const keys = await this.client.keys(`${this.keyPrefix}:*`);
    return Promise.all(keys.map((key) => this.getOrFail(key.split(':')[1])));
  }
}
