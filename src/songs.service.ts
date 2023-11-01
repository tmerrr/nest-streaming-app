import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Song, SongsRepository } from './songs.repository';
import config from './config';

export type UploadSongData = Omit<Song, 'id'>;

@Injectable()
export class SongsService {
  private repository = new SongsRepository();

  private s3Client = new S3Client({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsSecretKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  });

  async uploadSong(file: Buffer, songData: UploadSongData): Promise<Song> {
    const song: Song = {
      id: randomUUID(),
      name: songData.name,
      artist: songData.artist,
    };
    this.repository.save(song);
    const command = new PutObjectCommand({
      Bucket: config.s3BucketName,
      Key: song.id,
      Body: file,
      ContentType: 'audio/mpeg',
    });
    this.s3Client.send(command);
    return song;
  }

  listSongs(): Promise<Song[]> {
    return this.repository.list();
  }

  // "9dc5e36c-312a-478e-8ea5-649bc57036b5", # do you like it - our lady peace
  async getSongBufferById(
    id = '9dc5e36c-312a-478e-8ea5-649bc57036b5',
  ): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: config.s3BucketName,
      Key: id,
    });
    const data = await this.s3Client.send(command);
    return Buffer.from(await data.Body.transformToByteArray());
  }
}
