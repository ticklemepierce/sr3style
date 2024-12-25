import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { Card, ReviewLog } from 'ts-fsrs';
import { SetType } from '../src/types.ts';
import { User } from './user.entity.ts';

@Entity()
@Unique({ properties: ['caseId', 'setType'] })
export class LearningCase {
  constructor({ caseId, setType, card, log, user }: Omit<LearningCase, 'id'>) {
    this.caseId = caseId;
    this.setType = setType;
    this.card = card;
    this.log = log;
    this.user = user;
  }

  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string' })
  caseId!: string;

  @Property({ type: 'string' })
  setType!: SetType;

  @Property({ type: 'json' })
  card!: Card;

  @Property({ type: 'json', nullable: true })
  log?: ReviewLog;

  @ManyToOne(() => User)
  user!: User;
}
