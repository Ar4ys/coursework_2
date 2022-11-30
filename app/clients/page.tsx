import { db } from '@/services/db'
import { toSerializable } from '@/services/form'
import { sql } from 'kysely'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { ClientRowOptions } from './ClientRowOptions'
import { Table } from '@/components/Table'

export default async function ClientsPage() {
  const clients = await db
    .selectFrom('clients')
    .leftJoin('projects', 'projects.clientId', 'clients.id')
    .selectAll('clients')
    .select(sql<string[]>`array_agg(title)`.as('projects'))
    .groupBy('clients.id')
    .execute()

  return (
    <div className={styles.container}>
      <Table header={['Name', 'Projects', 'Since', 'Options']}>
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
      </Table>
    </div>
  )
}
