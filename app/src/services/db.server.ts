import { PrismaClient } from '@prisma/client';

import { MikroORM } from '@mikro-orm/postgresql';
import config from '../../../mikro-orm.config';

// TODO fix once MUI has esm
let orm: MikroORM;

export const getOrm = async () => {
  if (!orm) {
    orm = await MikroORM.init(config);
  }
  return orm;
};

export const prisma = new PrismaClient();
