import { redisClient } from '../clients/redis.client';

export type Song = {
  id: string;
  name: string;
  artist: string;
};

class SongNotFoundError extends Error {}

export class SongsRepository {
  private client = redisClient;

  private keyPrefix = 'song';

  // this function acts as an upsert, so will overwrite data if the key already exists
  public async save(song: Song): Promise<void> {
    await this.client.set(`${this.keyPrefix}:${song.id}`, JSON.stringify(song));
  }

  public async get(songId: string): Promise<Song | null> {
    const songData = await this.client.get(`${this.keyPrefix}:${songId}`);
    if (songData) {
      const song: Song = JSON.parse(songData);
      return {
        ...song,
        id: songId,
      };
    }
    return null;
  }

  public async list(): Promise<Song[]> {
    const keys = await this.client.keys(`${this.keyPrefix}:*`);
    return Promise.all(keys.map((key) => this.getStrict(key.split(':')[1])));
  }

  private async getStrict(songId: string): Promise<Song> {
    const song = await this.get(songId);
    if (!song) {
      throw new SongNotFoundError(`Song not found: ${songId}`);
    }
    return song;
  }
}
