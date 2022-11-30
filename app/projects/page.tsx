import { db, getClientsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { ProjectRowOptions } from './ProjectRowOptions'

export default async function Reports() {
  const [clients, projects] = await Promise.all([
    getClientsSelectOptions(),
    db
      .selectFrom('projects')
      .innerJoin('clients', 'clients.id', 'projects.clientId')
      .selectAll('projects')
      .select(['firstName', 'lastName'])
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
            <th>Since</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{`${project.firstName} ${project.lastName}`}</td>
              <td>{project.techStack.join(', ')}</td>
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
