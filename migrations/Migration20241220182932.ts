import { Migration } from '@mikro-orm/migrations';

export class Migration20241220182932 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "wca_id" varchar(255) not null, "is_comped" boolean not null default false);`,
    );
    this.addSql(
      `alter table "user" add constraint "user_wca_id_unique" unique ("wca_id");`,
    );

    this.addSql(
      `create table "set" ("id" serial primary key, "letter_pair" varchar(255) not null, "set_type" varchar(255) not null, "card" jsonb not null, "log" jsonb null, "user_id" int not null);`,
    );
    this.addSql(
      `alter table "set" add constraint "set_letter_pair_set_type_unique" unique ("letter_pair", "set_type");`,
    );

    this.addSql(
      `alter table "set" add constraint "set_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "set" drop constraint "set_user_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "set" cascade;`);
  }
}
