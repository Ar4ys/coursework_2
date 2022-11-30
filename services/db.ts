import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import { env } from 'process'
import PG from 'pg'
import { EmployeeRole } from './types'

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new PG.Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
})

export const getEmployeesSelectOptions = () =>
  db.selectFrom('employees').select(['id', 'firstName', 'lastName']).execute()

export const getProjectsSelectOptions = () =>
  db.selectFrom('projects').select(['id', 'title']).execute()

export const getClientsSelectOptions = () =>
  db.selectFrom('clients').select(['id', 'firstName', 'lastName']).execute()

export const getManagersSelectOptions = () =>
  db
    .selectFrom('employees')
    .select(['id', 'firstName', 'lastName'])
    .where('role', '=', EmployeeRole.Manager)
    .execute()
