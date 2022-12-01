import { sql } from 'kysely'
import { DateTime } from 'luxon'

import { db } from '@/services/db'
import { toSerializable } from '@/services/form'
import { Table } from '@/components/Table'
import { ClientRowOptions } from './ClientRowOptions'
import styles from './page.module.css'
import { NextPageProps } from '@/services/types'

export default async function ClientsPage({ searchParams }: NextPageProps) {
  const { firstName, lastName, createdAt } = searchParams
  let request = db
    .selectFrom('clients')
    .leftJoin('projects', 'projects.clientId', 'clients.id')
    .selectAll('clients')
    .select(sql<string[]>`array_agg(title)`.as('projects'))
    .groupBy('clients.id')

  if (firstName) request = request.where('clients.firstName', '=', firstName)
  if (lastName) request = request.where('clients.lastName', '=', lastName)
  if (createdAt) {
    const date = DateTime.fromISO(createdAt)
    if (date.isValid)
      request = request.where(sql`CAST(clients.created_at as date)`, '=', date.toISODate())
  }

  const clients = await request.execute()

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
