import { Migration } from '@mikro-orm/migrations';

export class Migration20250119185902 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "wca_id" varchar(255) not null, "is_comped" boolean not null, "settings" jsonb not null);`,
    );
    this.addSql(
      `alter table "user" add constraint "user_wca_id_unique" unique ("wca_id");`,
    );

    this.addSql(
      `create table "learning_case" ("id" serial primary key, "case_id" varchar(255) not null, "set_type" varchar(255) not null, "card" jsonb not null, "log" jsonb null, "user_id" int not null);`,
    );
    this.addSql(
      `alter table "learning_case" add constraint "learning_case_case_id_set_type_unique" unique ("case_id", "set_type");`,
    );

    this.addSql(
      `alter table "learning_case" add constraint "learning_case_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }
}
