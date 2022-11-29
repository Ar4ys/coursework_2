import 'dotenv/config'
import { env } from 'process'
import PG from 'pg'
import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely'
import { DB } from 'kysely-codegen'
import { DateTime } from 'luxon'

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new PG.Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
})

async function seed() {
  console.log('Nuking DB :D')
  await deleteSeeds()

  console.log('Creating clients...')
  const [matthew] = await db
    .insertInto('clients')
    .values([
      {
        firstName: 'Matthew',
        lastName: 'Valtchanovsen',
      },
    ])
    .returning('id')
    .execute()

  console.log('Creating projects...')
  const [matthewProject] = await db
    .insertInto('projects')
    .values([
      {
        clientId: matthew.id,
        title: "Matthew's Project",
      },
    ])
    .returning('id')
    .execute()

  console.log('Creating employees...')
  const [richard] = await db
    .insertInto('employees')
    .values([
      {
        firstName: 'Richard',
        lastName: 'Putnamsky',
        role: 'Developer',
        price: 10,
      },
    ])
    .returning('id')
    .execute()

  console.log('Creating reports...')
  await db
    .insertInto('reports')
    .values([
      {
        employeeId: richard.id,
        date: DateTime.now().minus({ day: 2 }).toJSDate(),
        duration: 4,
        type: 'Estimation',
        projectId: matthewProject.id,
      },
      {
        employeeId: richard.id,
        date: DateTime.now().minus({ day: 2 }).toJSDate(),
        duration: 4,
        type: 'Development',
        projectId: matthewProject.id,
      },
      {
        employeeId: richard.id,
        date: DateTime.now().toJSDate(),
        duration: 8,
        type: 'Development',
        note: 'Work On',
        projectId: matthewProject.id,
      },
    ])
    .execute()

  console.log('Creating vacations...')
  await db
    .insertInto('vacations')
    .values([
      {
        employeeId: richard.id,
        startDate: DateTime.now().minus({ day: 1 }).toJSDate(),
        endDate: DateTime.now().minus({ day: 1 }).toJSDate(),
        type: 'Work Off',
        note: 'Appointment to the Doctor',
      },
    ])
    .execute()

  await db.destroy()
}

async function deleteSeeds() {
  // We are using object here to be able to check at compile time if we have listed all tables
  const tables: Record<keyof DB, true> = {
    reports: true,
    vacations: true,
    projectsEmployees: true,
    employees: true,
    projects: true,
    clients: true,
  }

  for (const name of Object.keys(tables) as Array<keyof DB>) {
    await db.deleteFrom(name).execute()
  }
}

seed()
