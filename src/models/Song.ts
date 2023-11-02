import { randomUUID } from 'crypto';
import { Entity, PrimaryColumn, Column } from 'typeorm';

export type SongProps = {
  name: string;
  artist: string;
};

export type SongRaw = {
  id: string;
  name: string;
  artist: string;
  createdAt: Date;
};

@Entity()
export class Song {
  static create(props: SongProps): Song {
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
    if (!props) {
      this.id = '';
      this.name = '';
      this.artist = '';
      this.createdAt = new Date();
    } else {
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
