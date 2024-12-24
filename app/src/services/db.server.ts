import { User } from '../../entities/user.entity';

import { MikroORM } from '@mikro-orm/postgresql';
import config from 'mikro-orm.config';

export const { em } = await MikroORM.init(config);

export const userRepo = em.fork().getRepository(User);
