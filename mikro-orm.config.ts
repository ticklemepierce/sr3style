import { defineConfig, Dictionary } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from './app/entities/user.entity.ts';
import { LearningCase } from './app/entities/learning-case.entity.ts';
import { config } from 'dotenv';

config();

const driverOptions: Dictionary = {
  version: '7.2',
};

if (process.env.DATABASE_SSL === 'true') {
  driverOptions['connection'] = { ssl: true };
}

export default defineConfig({
  metadataProvider: TsMorphMetadataProvider,
  clientUrl: process.env.DATABASE_URL,
  entities: [User, LearningCase],
  discovery: { disableDynamicFileAccess: true },
  driverOptions,
});
