import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { Card as FsrsCard, ReviewLog } from 'ts-fsrs';
import { SetType } from '../src/types';
import { User } from './user.entity';

@Entity()
@Unique({ properties: ['letterPair', 'setType'] }) // Define unique constraint here
export class LearningSet {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string' })
  letterPair!: string;

  @Property({ type: 'string' })
  setType!: SetType;

  @Property({ type: 'json' })
  fsrsCard!: FsrsCard;

  @Property({ type: 'json', nullable: true })
  log?: ReviewLog;

  @ManyToOne(() => User)
  user!: User;
}
