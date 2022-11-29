import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TYPE "employee_role" AS ENUM (
      'developer',
      'designer',
      'manager',
      'marketeer',
      'data_analyst',
      'qa'
    );

    CREATE TYPE "report_type" AS ENUM (
      'development',
      'estimation',
      'meeting',
      'interview',
      'self_education'
    );

    CREATE TYPE "vacation_type" AS ENUM (
      'vacation',
      'work_off',
      'unpaid_leave',
      'paid_leave',
      'sick_leave'
    );

    CREATE TYPE "vacation_status" AS ENUM (
      'pending',
      'rejected',
      'accepted'
    );

    CREATE TABLE "clients" (
      "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
      "first_name" varchar(255),
      "last_name" varchar(255),
      "created_at" timestamp DEFAULT (now()),
      "updated_at" timestamp DEFAULT (now())
    );

    CREATE TABLE "projects" (
      "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
      "title" varchar(255),
      "tech_stack" varchar(255)[],
      "client_id" uuid,
      "created_at" timestamp DEFAULT (now()),
      "updated_at" timestamp DEFAULT (now())
    );

    CREATE TABLE "employees" (
      "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
      "role" employee_role NOT NULL,
      "first_name" varchar(255),
      "last_name" varchar(255),
      "tech_stack" varchar(255)[],
      "price" float8,
      "created_at" timestamp DEFAULT (now()),
      "updated_at" timestamp DEFAULT (now())
    );

    CREATE TABLE "reports" (
      "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
      "date" date,
      "duration" float8,
      "type" report_type,
      "note" varchar(255),
      "project_id" uuid,
      "employee_id" uuid,
      "created_at" timestamp DEFAULT (now()),
      "updated_at" timestamp DEFAULT (now())
    );

    CREATE TABLE "vacations" (
      "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
      "start_date" timestamp,
      "end_date" timestamp,
      "type" vacation_type,
      "status" vacation_status DEFAULT ('pending'),
      "note" varchar(255),
      "employee_id" uuid,
      "manager_id" uuid,
      "created_at" timestamp DEFAULT (now()),
      "updated_at" timestamp DEFAULT (now())
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
  const tables = ['projects_employees', 'vacations', 'employees', 'projects', 'clients']
  const enums = ['vacation_status', 'vacation_type', 'report_type', 'employee_role']
  for (const name of tables) await db.schema.dropTable(name).ifExists().cascade().execute()
  for (const name of enums) await db.schema.dropType(name).ifExists().execute()
}
