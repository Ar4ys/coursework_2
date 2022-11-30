import { db, getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { sql } from 'kysely'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { ClientRowOptions } from './ClientRowOptions'

export default async function Reports() {
  const clients = await db
    .selectFrom('clients')
    .leftJoin('projects', 'projects.clientId', 'clients.id')
    .selectAll('clients')
    .select(sql<string[]>`array_agg(title)`.as('projects'))
    .groupBy('clients.id')
    .execute()

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Projects</th>
            <th>Since</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{`${client.firstName} ${client.lastName}`}</td>
              <td>{client.projects.join(', ')}</td>
              <td>{DateTime.fromJSDate(client.createdAt).toLocaleString()}</td>
              <td>
                <ClientRowOptions client={toSerializable(client)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
