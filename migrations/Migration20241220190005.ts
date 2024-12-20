import { Migration } from '@mikro-orm/migrations';

export class Migration20241220190005 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "learning_set" rename column "card" to "fsrs_card";`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "learning_set" rename column "fsrs_card" to "card";`,
    );
  }
}
