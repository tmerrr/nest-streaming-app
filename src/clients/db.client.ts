import { DataSource } from 'typeorm';
import config from '../config';
import { Song } from '../models/Song';
import { Playlist } from '../models/Playlist';

const { db: dbConfig } = config;

export const db = new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.name,
  username: dbConfig.user,
  password: dbConfig.password,
  entities: [Song, Playlist],
  // don't use in real-world:
  synchronize: true, // auto creates and updates tables
});
