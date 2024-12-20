import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { LearningSet } from './set.entity'; // Assuming you have Set defined in a separate file

@Entity()
export class User {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string', unique: true })
  wcaId!: string;

  @Property({ type: 'boolean', default: false })
  isComped!: boolean;

  @OneToMany(() => LearningSet, (learningSet) => learningSet.user)
  learningSets = new Collection<LearningSet>(this);
}
