import { randomUUID } from 'crypto';
import { Entity, PrimaryColumn, Column } from 'typeorm';

export type SongProps = {
  name: string;
  artist: string;
};

type InitSongProps = Omit<SongProps, 'createdAt'>;

export type SongRaw = {
  id: string;
  name: string;
  artist: string;
  createdAt: Date;
};

@Entity()
export class Song {
  static create(props: InitSongProps): Song {
    return new Song({
      ...props,
      id: randomUUID(),
      createdAt: new Date(),
    });
  }

  static fromRaw(props: SongRaw): Song {
    return new Song(props);
  }

  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column({ nullable: false, type: 'text' })
  public readonly name: string;

  @Column({ nullable: false, type: 'text' })
  public readonly artist: string;

  @Column({ nullable: false, type: 'timestamp' })
  public readonly createdAt: Date;

  private constructor(props: SongRaw) {
    if (props) {
      this.id = props.id;
      this.name = props.name;
      this.artist = props.artist;
      this.createdAt = props.createdAt;
    }
  }

  public toRaw(): SongRaw {
    return {
      id: this.id,
      name: this.name,
      artist: this.artist,
      createdAt: this.createdAt,
    };
  }
}
