import { db, getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { ReportRowOptions } from './ReportRowOptions'

export default async function Reports() {
  const [employees, projects, reports] = await Promise.all([
    getEmployeesSelectOptions(),
    getProjectsSelectOptions(),
    db
      .selectFrom('reports')
      .innerJoin('employees', 'employees.id', 'reports.employeeId')
      .leftJoin('projects', 'projects.id', 'reports.projectId')
      .selectAll('reports')
      .select(['firstName', 'lastName', 'title as projectTitle'])
      .orderBy('date', 'desc')
      .execute(),
  ])

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Author</th>
            <th>Project</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Hours</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{`${report.firstName} ${report.lastName}`}</td>
              <td>{report.projectTitle}</td>
              <td>{report.type}</td>
              <td>{report.note}</td>
              <td>{DateTime.fromJSDate(report.date).toLocaleString()}</td>
              <td>{report.duration}</td>
              <td>
                <ReportRowOptions
                  report={toSerializable(report)}
                  authors={employees}
                  projects={projects}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
