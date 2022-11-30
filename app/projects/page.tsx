import { db, getClientsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { sql } from 'kysely'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { ProjectRowOptions } from './ProjectRowOptions'

export default async function Reports() {
  const [clients, projects] = await Promise.all([
    getClientsSelectOptions(),
    db
      .selectFrom('projects')
      .innerJoin('clients', 'clients.id', 'projects.clientId')
      .leftJoin('reports', 'reports.projectId', 'projects.id')
      .leftJoin('employees', 'employees.id', 'reports.employeeId')
      .selectAll('projects')
      .select([
        sql<string>`concat(clients.first_name, ' ', clients.last_name)`.as('clientName'),
        sql<
          string[]
        >`array_agg(distinct concat(employees.first_name, ' ', employees.last_name))`.as(
          'employees',
        ),
      ])
      .groupBy(['projects.id', 'clients.firstName', 'clients.lastName'])
      .execute(),
  ])

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Tech Stack</th>
            <th>Employees</th>
            <th>Since</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  )
}
