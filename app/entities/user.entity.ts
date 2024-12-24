import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { LearningSet } from './set.entity.ts'; // Assuming you have Set defined in a separate file
import { Settings } from '../src/types';

type UserConstructorParams = Required<Pick<User, 'wcaId'>> &
  Partial<Pick<User, 'isComped' | 'settings'>>;

const defaultVals = {
  isComped: false,
  settings: { autoAddInverse: false },
};
@Entity()
export class User {
  constructor({
    wcaId,
    isComped = defaultVals.isComped,
    settings = defaultVals.settings,
  }: UserConstructorParams) {
    this.isComped = isComped;
    this.settings = settings;
    this.wcaId = wcaId;
  }

  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string', unique: true })
  wcaId!: string;

  @Property({ type: 'boolean' })
  isComped: boolean;

  @OneToMany(() => LearningSet, (learningSet) => learningSet.user)
  learningSets = new Collection<LearningSet>(this);

  @Property({ type: 'json' })
  settings: Settings;
}
