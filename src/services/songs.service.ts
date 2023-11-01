import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AwsS3Client } from '../clients/s3.client';
import { Song, SongsRepository } from '../repositories/songs.repository';

export type UploadSongData = Omit<Song, 'id'>;

@Injectable()
export class SongsService {
  private repository = new SongsRepository();

  private s3Client = new AwsS3Client();

  public async uploadSong(
    file: Buffer,
    songData: UploadSongData,
  ): Promise<Song> {
    const song: Song = {
      id: randomUUID(),
      name: songData.name,
      artist: songData.artist,
    };
    await this.repository.save(song);
    this.s3Client.putObject(song.id, file);
    return song;
  }

  public listSongs(): Promise<Song[]> {
    return this.repository.list();
  }

  public getSongBufferById(id: string): Promise<Buffer> {
    return this.s3Client.getObject(id);
  }
}
