import { DataSource } from 'typeorm';
import config from '../config';
import { Song } from '../models/Song';
import { Playlist } from '../models/Playlist';

const { db } = config;

const ds = new DataSource({
  type: 'postgres',
  host: db.host,
  port: db.port,
  database: db.name,
  username: db.user,
  password: db.password,
  entities: [Song, Playlist],
  // don't use in real-world:
  synchronize: true, // auto creates and updates tables
});

export default ds;
