import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import { env } from 'process'
import PG from 'pg'

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new PG.Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
})
