import { Song } from '../models/Song';
import db from '../clients/db.client';

class SongNotFoundError extends Error {}

export class SongsRepository {
  private client = db.getRepository(Song);

  // this function acts as an upsert, so will overwrite data if the key already exists
  public async save(song: Song): Promise<void> {
    await this.client.save(song);
  }

  public async get(songId: string): Promise<Song | null> {
    return this.client.findOneBy({ id: songId });
  }

  public async getOrFail(songId: string): Promise<Song> {
    const song = await this.get(songId);
    if (!song) {
      throw new SongNotFoundError(`Song not found: ${songId}`);
    }
    return song;
  }

  public async list(): Promise<Song[]> {
    return this.client.find();
  }
}
