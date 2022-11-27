import 'dotenv/config'
import { env } from 'process'
import { fileURLToPath } from 'url'
import * as path from 'path'
import * as fs from 'fs/promises'
import PG from 'pg'
import { Kysely, Migrator, PostgresDialect, FileMigrationProvider, CamelCasePlugin } from 'kysely'

async function migrateToLatest() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new PG.Pool({
        connectionString: env.DATABASE_URL,
      }),
    }),
    plugins: [new CamelCasePlugin()],
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(fileURLToPath(import.meta.url), '..', '..', 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  for (const result of results ?? []) {
    if (result.status === 'Success') {
      console.log(`migration "${result.migrationName}" was executed successfully`)
    } else if (result.status === 'Error') {
      console.error(`failed to execute migration "${result.migrationName}"`)
    }
  }

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
