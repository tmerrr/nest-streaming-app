import { Inject, Injectable } from '@nestjs/common';
import { Song } from '../models/Song';
import { DataSource, Repository } from 'typeorm';

class SongNotFoundError extends Error {}

@Injectable()
export class SongsRepository {
  private readonly client: Repository<Song>;

  // constructor(private readonly client: Repository<Song>) {
  constructor(@Inject('DataSource') dataSource: DataSource) {
    this.client = dataSource.getRepository(Song);
  }

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
