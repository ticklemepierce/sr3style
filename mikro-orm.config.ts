import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from './app/entities/user.entity.ts';
import { LearningSet } from './app/entities/set.entity.ts';
import { config } from 'dotenv';

config();

export default defineConfig({
  // folder-based discovery setup, using common filename suffix
  // entities: ['build/**/*.entity.js'],
  // entities: ['app/entities/*.entity.ts'],
  // entitiesTs: ['app/entities/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  clientUrl: process.env.DATABASE_URL,
  entities: [User, LearningSet],
  discovery: { disableDynamicFileAccess: true },
  driverOptions: {
    version: '7.2',
    connection: { ssl: true },
  },
});
