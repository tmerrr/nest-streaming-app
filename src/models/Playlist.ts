import { randomUUID } from 'crypto';
import { shuffle } from 'lodash';

export type PlaylistProps = {
  name: string;
  songIds: string[];
};

export type PlaylistRaw = {
  id: string;
  name: string;
  songIds: string[];
  currentSongIndex: number;
};

export class Playlist {
  static create(props: PlaylistProps): Playlist {
    const currentSongIndex = props.songIds.length - 1;
    return new Playlist({
      ...props,
      id: randomUUID(),
      currentSongIndex,
    });
  }

  static fromRaw(props: PlaylistRaw): Playlist {
    return new Playlist(props);
  }

  public readonly id: string;

  public readonly name: string;

  public songIds: string[];

  private currentSongIndex: number;

  private constructor(props: PlaylistRaw) {
    this.id = props.id;
    this.name = props.name;
    this.songIds = props.songIds;
    this.currentSongIndex = props.currentSongIndex;
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
