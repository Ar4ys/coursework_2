import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TYPE "employee_role" AS ENUM (
      'Developer',
      'Designer',
      'Manager',
      'Marketeer',
      'Data Analyst',
      'QA'
    );

    CREATE TYPE "report_type" AS ENUM (
      'Development',
      'Estimation',
      'Meeting',
      'Interview',
      'Self Education'
    );

    CREATE TYPE "vacation_type" AS ENUM (
      'Vacation',
      'Work Off',
      'Unpaid Leave',
      'Paid Leave',
      'Sick Leave'
    );

    CREATE TYPE "vacation_status" AS ENUM (
      'Pending',
      'Rejected',
      'Accepted'
    );

    CREATE TABLE "clients" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
      "first_name" varchar(255) NOT NULL,
      "last_name" varchar(255) NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT (now()),
      "updated_at" timestamp NOT NULL DEFAULT (now())
    );

    CREATE TABLE "projects" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
      "title" varchar(255) NOT NULL,
      "tech_stack" varchar(255)[] NOT NULL DEFAULT '{}',
      "client_id" uuid NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT (now()),
      "updated_at" timestamp NOT NULL DEFAULT (now())
    );

    CREATE TABLE "employees" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
      "role" employee_role NOT NULL,
      "first_name" varchar(255) NOT NULL,
      "last_name" varchar(255) NOT NULL,
      "tech_stack" varchar(255)[] NOT NULL DEFAULT '{}',
      "price" float8 NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT (now()),
      "updated_at" timestamp NOT NULL DEFAULT (now())
    );

    CREATE TABLE "reports" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
      "date" date NOT NULL,
      "duration" float8 NOT NULL,
      "type" report_type NOT NULL,
      "note" varchar(255),
      "project_id" uuid,
      "employee_id" uuid NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT (now()),
      "updated_at" timestamp NOT NULL DEFAULT (now())
    );

    CREATE TABLE "vacations" (
      "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
      "start_date" timestamp NOT NULL,
      "end_date" timestamp NOT NULL,
      "type" vacation_type NOT NULL,
      "status" vacation_status NOT NULL DEFAULT 'Pending',
      "note" varchar(255),
      "employee_id" uuid NOT NULL,
      "manager_id" uuid,
      "created_at" timestamp NOT NULL DEFAULT (now()),
      "updated_at" timestamp NOT NULL DEFAULT (now())
    );

    COMMENT ON COLUMN "employees"."price" IS 'Per hour price';

    ALTER TABLE "projects" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("id");

    CREATE TABLE "projects_employees" (
      "projects_id" uuid,
      "employees_id" uuid,
      PRIMARY KEY ("projects_id", "employees_id")
    );

    ALTER TABLE "projects_employees" ADD FOREIGN KEY ("projects_id") REFERENCES "projects" ("id");

    ALTER TABLE "projects_employees" ADD FOREIGN KEY ("employees_id") REFERENCES "employees" ("id");


    ALTER TABLE "reports" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

    ALTER TABLE "reports" ADD FOREIGN KEY ("employee_id") REFERENCES "employees" ("id");

    ALTER TABLE "vacations" ADD FOREIGN KEY ("employee_id") REFERENCES "employees" ("id");

    ALTER TABLE "vacations" ADD FOREIGN KEY ("manager_id") REFERENCES "employees" ("id");
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  const tables = ['projects_employees', 'vacations', 'reports', 'employees', 'projects', 'clients']
  const enums = ['vacation_status', 'vacation_type', 'report_type', 'employee_role']
  for (const name of tables) await db.schema.dropTable(name).ifExists().cascade().execute()
  for (const name of enums) await db.schema.dropType(name).ifExists().execute()
}
