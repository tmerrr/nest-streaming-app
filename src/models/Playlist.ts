import { Entity, PrimaryColumn, Column } from 'typeorm';
import { randomUUID } from 'crypto';
import { isEmpty, shuffle } from 'lodash';

export type PlaylistProps = {
  name: string;
  songIds: string[];
};

type InitPlaylistProps = Omit<PlaylistProps, 'createdAt'>;

export type PlaylistRaw = {
  id: string;
  name: string;
  songIds: string[];
  currentSongIndex: number;
  createdAt: Date;
};

@Entity()
export class Playlist {
  static create(props: InitPlaylistProps): Playlist {
    const currentSongIndex = isEmpty(props.songIds) ? -1 : 0;
    return new Playlist({
      ...props,
      id: randomUUID(),
      currentSongIndex,
      createdAt: new Date(),
    });
  }

  static fromRaw(props: PlaylistRaw): Playlist {
    return new Playlist(props);
  }

  @PrimaryColumn('uuid')
  public readonly id: string;

  @Column({ nullable: false, type: 'text' })
  public readonly name: string;

  @Column({ nullable: false, type: 'jsonb' })
  public songIds: string[];

  @Column({ nullable: false, type: 'int' })
  private currentSongIndex: number;

  @Column({ nullable: false, type: 'timestamp' })
  public readonly createdAt: Date;

  private constructor(props: PlaylistRaw) {
    if (props) {
      this.id = props.id;
      this.name = props.name;
      this.songIds = props.songIds;
      this.currentSongIndex = props.currentSongIndex;
      this.createdAt = props.createdAt;
    }
  }

  public toRaw(): PlaylistRaw {
    return {
      id: this.id,
      name: this.name,
      songIds: this.songIds,
      currentSongIndex: this.currentSongIndex,
      createdAt: this.createdAt,
    };
  }

  get currentSongId(): string | null {
    if (this.songIds.length === 0) {
      return null;
    }
    return this.songIds[this.currentSongIndex];
  }

  public addSong(songId: string): this {
    this.songIds.push(songId);
    if (this.currentSongIndex < 0) {
      this.currentSongIndex++;
    }
    return this;
  }

  public addSongs(songIds: string[]): this {
    this.songIds.push(...songIds);
    if (this.currentSongIndex < 0) {
      this.currentSongIndex++;
    }
    return this;
  }

  public removeSong(songId: string): this {
    const index = this.songIds.indexOf(songId);
    if (index < 0) {
      return this;
    }
    this.songIds.splice(index, 1);
    this.currentSongIndex = Math.min(
      this.currentSongIndex,
      this.songIds.length - 1,
    );
    return this;
  }

  public shuffle(): this {
    this.songIds = shuffle(this.songIds);
    return this;
  }

  public incrementCurrentSong(): this {
    if (this.songIds.length === 0) {
      return this;
    }
    this.currentSongIndex++;
    this.currentSongIndex = this.currentSongIndex % this.songIds.length;
    return this;
  }
}
