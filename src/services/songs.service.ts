import { Inject, Injectable } from '@nestjs/common';

import config from '../config';
import { AwsS3Client } from '../clients/s3.client';
import { RedisClient } from '../clients/redis.client';
import { Song, SongProps } from '../models/Song';
import { SongsRepository } from '../repositories/songs.repository';

@Injectable()
export class SongsService {
  constructor(
    private readonly repository: SongsRepository,
    private readonly s3Client: AwsS3Client,
    @Inject('RedisClient') private readonly cache: RedisClient,
  ) {}

  public async uploadSong(file: Buffer, songData: SongProps): Promise<Song> {
    const song = Song.create(songData);
    await this.repository.save(song);
    this.s3Client.putObject(song.id, file);
    return song;
  }

  public listSongs(): Promise<Song[]> {
    return this.repository.list();
  }

  public async getSongBufferById(id: string): Promise<Buffer> {
    const cachedFile = await this.cache.get(id);
    if (cachedFile) {
      console.log('Returning cached song...');
      return Buffer.from(cachedFile, 'base64'); // Decode the cached data from base64
    }

    const songFile = await this.s3Client.getObject(id);
    console.log('Caching song...');

    // Serialize the buffer to base64 before caching
    const serializedSongFile = songFile.toString('base64');
    await this.cache.set(id, serializedSongFile, { EX: config.cache.ttl });

    return songFile;
  }
}
