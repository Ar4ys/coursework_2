import { DateTime } from 'luxon'
import { db, getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { Table } from '@/components/Table'
import { ReportRowOptions } from './ReportRowOptions'
import styles from './page.module.css'
import { NextPageProps, ReportType } from '@/services/types'
import { sql } from 'kysely'

export default async function ReportsPage({ searchParams }: NextPageProps) {
  const { date, employeeId, projectId, type, duration, note } = searchParams

  let request = db
    .selectFrom('reports')
    .innerJoin('employees', 'employees.id', 'reports.employeeId')
    .leftJoin('projects', 'projects.id', 'reports.projectId')
    .selectAll('reports')
    .select(['firstName', 'lastName', 'title as projectTitle'])
    .orderBy('date', 'desc')

  if (note) request = request.where('reports.note', 'like', '%' + note + '%')
  if (employeeId) request = request.where('reports.employeeId', '=', employeeId)
  if (projectId) request = request.where('reports.projectId', '=', projectId)
  if (type) request = request.where('reports.type', '=', type as ReportType)
  if (duration) request = request.where('reports.duration', '=', Number(duration))
  if (date) {
    const dateTime = DateTime.fromISO(date)
    if (dateTime.isValid)
      request = request.where(sql`CAST(reports.date as date)`, '=', dateTime.toISODate())
  }

  const [employees, projects, reports] = await Promise.all([
    getEmployeesSelectOptions(),
    getProjectsSelectOptions(),
    request.execute(),
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
