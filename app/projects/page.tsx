import { sql } from 'kysely'
import { DateTime } from 'luxon'

import { db, getClientsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { Table } from '@/components/Table'
import { NextPageProps } from '@/services/types'
import { ProjectRowOptions } from './ProjectRowOptions'
import styles from './page.module.css'

export default async function ProjectsPage({ searchParams }: NextPageProps) {
  const { title, techStack, clientId } = searchParams
  let request = db
    .selectFrom('projects')
    .innerJoin('clients', 'clients.id', 'projects.clientId')
    .leftJoin('reports', 'reports.projectId', 'projects.id')
    .leftJoin('employees', 'employees.id', 'reports.employeeId')
    .selectAll('projects')
    .select([
      sql<string>`concat(clients.first_name, ' ', clients.last_name)`.as('clientName'),
      sql<string[]>`array_agg(distinct concat(employees.first_name, ' ', employees.last_name))`.as(
        'employees',
      ),
    ])
    .groupBy(['projects.id', 'clients.firstName', 'clients.lastName'])

  if (title) request = request.where('projects.title', 'like', '%' + title + '%')
  if (clientId) request = request.where('projects.clientId', '=', clientId)
  if (techStack)
    request = request.where(
      'projects.techStack',
      '@>',
      sql`array[${techStack
        .split(',')
        .map(tech => tech.trim())
        .toString()}]::varchar[]`,
    )

  const [clients, projects] = await Promise.all([getClientsSelectOptions(), request.execute()])

  return (
    <div className={styles.container}>
      <Table header={['Title', 'Client', 'Tech Stack', 'Employees', 'Since', 'Options']}>
        {projects.map(project => (
          <tr key={project.id}>
            <td>{project.title}</td>
            <td>{project.clientName}</td>
            <td>{project.techStack.join(', ')}</td>
            <td>{project.employees.join(', ')}</td>
            <td>{DateTime.fromJSDate(project.createdAt).toLocaleString()}</td>
            <td>
              <ProjectRowOptions
                clients={toSerializable(clients)}
                project={toSerializable(project)}
              />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}
