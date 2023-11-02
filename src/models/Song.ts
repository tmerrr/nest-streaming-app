import { randomUUID } from 'crypto';

export type SongProps = {
  name: string;
  artist: string;
};

export type SongRaw = {
  id: string;
  name: string;
  artist: string;
};

export class Song {
  static create(props: Omit<SongProps, 'id'>): Song {
    return new Song({
      ...props,
      id: randomUUID(),
    });
  }

  static fromRaw(props: SongRaw): Song {
    return new Song(props);
  }

  public readonly id: string;

  public readonly name: string;

  public readonly artist: string;

  private constructor(props: SongRaw) {
    this.id = props.id;
    this.name = props.name;
    this.artist = props.artist;
  }

  public toRaw(): SongRaw {
    return {
      id: this.id,
      name: this.name,
      artist: this.artist,
    };
  }
}
