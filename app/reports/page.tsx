import { Table } from '@/components/Table'
import { db, getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { ReportRowOptions } from './ReportRowOptions'

export default async function ReportsPage() {
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
      <Table header={['Author', 'Project', 'Category', 'Description', 'Date', 'Hours', 'Options']}>
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
      </Table>
    </div>
  )
}
