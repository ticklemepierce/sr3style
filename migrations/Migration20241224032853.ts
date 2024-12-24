import { Migration } from '@mikro-orm/migrations';

export class Migration20241224032853 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "wca_id" varchar(255) not null, "is_comped" boolean not null, "settings" jsonb not null);`,
    );
    this.addSql(
      `alter table "user" add constraint "user_wca_id_unique" unique ("wca_id");`,
    );

    this.addSql(
      `create table "learning_set" ("id" serial primary key, "letter_pair" varchar(255) not null, "set_type" varchar(255) not null, "fsrs_card" jsonb not null, "log" jsonb null, "user_id" int not null);`,
    );
    this.addSql(
      `alter table "learning_set" add constraint "learning_set_letter_pair_set_type_unique" unique ("letter_pair", "set_type");`,
    );

    this.addSql(
      `alter table "learning_set" add constraint "learning_set_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "learning_set" drop constraint "learning_set_user_id_foreign";`,
    );

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "learning_set" cascade;`);
  }
}
