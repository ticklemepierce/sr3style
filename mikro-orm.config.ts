import { defineConfig, Dictionary } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { User } from './app/entities/user.entity.ts';
import { LearningCase } from './app/entities/learning-case.entity.ts';
import { config } from 'dotenv';

config();

const driverOptions: Dictionary = {
  version: '7.2',
};

const caCert = process.env.COCKROACH_CA_CERT;

if (process.env.IS_PROD_MIGRATION || process.env.NODE_ENV === 'production') {
  driverOptions['connection'] = { ssl: caCert };
}

export default defineConfig({
  metadataProvider: TsMorphMetadataProvider,
  clientUrl: process.env.IS_PROD_MIGRATION
    ? process.env.PROD_DATABASE_URL
    : process.env.DATABASE_URL,
  entities: [User, LearningCase],
  discovery: { disableDynamicFileAccess: true },
  driverOptions,
});
