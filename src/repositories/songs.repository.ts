import { redisClient } from '../clients/redis.client';
import { Song, SongRaw } from '../models/Song';

class SongNotFoundError extends Error {}

export class SongsRepository {
  private client = redisClient;

  private keyPrefix = 'song';

  // this function acts as an upsert, so will overwrite data if the key already exists
  public async save(song: Song): Promise<void> {
    await this.client.set(
      `${this.keyPrefix}:${song.id}`,
      JSON.stringify(song.toRaw),
    );
  }

  public async get(songId: string): Promise<Song | null> {
    const songData = await this.client.get(`${this.keyPrefix}:${songId}`);
    if (songData) {
      const songRaw: SongRaw = JSON.parse(songData);
      return Song.fromRaw(songRaw);
    }
    return null;
  }

  public async getOrFail(songId: string): Promise<Song> {
    const song = await this.get(songId);
    if (!song) {
      throw new SongNotFoundError(`Song not found: ${songId}`);
    }
    return song;
  }

  public async list(): Promise<Song[]> {
    const keys = await this.client.keys(`${this.keyPrefix}:*`);
    return Promise.all(keys.map((key) => this.getOrFail(key.split(':')[1])));
  }
}
