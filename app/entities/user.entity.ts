import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { LearningCase } from './learning-case.entity.ts';
import { Settings } from '../src/types';
import { DEFAULT_SETTINGS } from '../src/utils/constants.ts';

type UserConstructorParams = Required<Pick<User, 'wcaId'>> &
  Partial<Pick<User, 'isComped' | 'settings'>>;

const defaultVals = {
  isComped: false,
  settings: DEFAULT_SETTINGS,
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

  @OneToMany(() => LearningCase, (learningCase) => learningCase.user)
  learningCases = new Collection<LearningCase>(this);

  @Property({ type: 'json' })
  settings: Settings;
}
