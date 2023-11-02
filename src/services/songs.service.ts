import { Injectable } from '@nestjs/common';
import { AwsS3Client } from '../clients/s3.client';
import { SongsRepository } from '../repositories/songs.repository';
import { Song, SongProps } from '../models/Song';

@Injectable()
export class SongsService {
  private repository = new SongsRepository();

  private s3Client = new AwsS3Client();

  public async uploadSong(file: Buffer, songData: SongProps): Promise<Song> {
    const song = Song.create(songData);
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
