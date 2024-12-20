import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from 'app/entities/user.entity';
import { config } from 'dotenv';

config();

export default defineConfig({
  // folder-based discovery setup, using common filename suffix
  // entities: ['build/**/*.entity.js'],
  // entitiesTs: ['src/**/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  clientUrl: process.env.DATABASE_URL,
  entities: [User],
  discovery: { disableDynamicFileAccess: true },
  driverOptions: {
    version: '7.2',
    connection: { ssl: true },
  },
});
