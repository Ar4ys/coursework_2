import { DateTime } from 'luxon'
import { toSerializable } from '@/services/form'
import { db, getEmployeesSelectOptions, getManagersSelectOptions } from '@/services/db'
import { Table } from '@/components/Table'
import { NextPageProps, VacationStatus, VacationType } from '@/services/types'
import { VacationRowOptions } from './VacationRowOptions'
import styles from './page.module.css'
import { sql } from 'kysely'

export default async function VacationsPage({ searchParams }: NextPageProps) {
  const { employeeId, managerId, type, startDate, endDate, status, note } = searchParams

  let request = db
    .selectFrom('vacations')
    .innerJoin('employees', 'employees.id', 'vacations.employeeId')
    .leftJoin('employees as managers', 'managers.id', 'vacations.managerId')
    .selectAll('vacations')
    .select([
      'employees.firstName as employeeFirstName',
      'employees.lastName as employeeLastName',
      'managers.firstName as managerFirstName',
      'managers.lastName as mangerLastName',
    ])

  if (note) request = request.where('vacations.note', 'like', '%' + note + '%')
  if (employeeId) request = request.where('vacations.employeeId', '=', employeeId)
  if (managerId) request = request.where('vacations.managerId', '=', managerId)
  if (type) request = request.where('vacations.type', '=', type as VacationType)
  if (status) request = request.where('vacations.status', '=', status as VacationStatus)
  if (startDate) {
    const dateTime = DateTime.fromISO(startDate)
    if (dateTime.isValid)
      request = request.where(sql`CAST(vacations.date as date)`, '=', dateTime.toISODate())
  }
  if (endDate) {
    const dateTime = DateTime.fromISO(endDate)
    if (dateTime.isValid)
      request = request.where(sql`CAST(vacations.date as date)`, '=', dateTime.toISODate())
  }

  const [employees, managers, vacations] = await Promise.all([
    getEmployeesSelectOptions(),
    getManagersSelectOptions(),
    request.execute(),
  ])

  return (
    <div className={styles.container}>
      <Table
        header={['Employee', 'Category', 'Start', 'End', 'Status', 'Manged By', 'Note', 'Options']}
        suspense
      >
        {vacations.map(vacation => (
          <tr key={vacation.id}>
            <td>{`${vacation.employeeFirstName} ${vacation.employeeLastName}`}</td>
            <td>{vacation.type}</td>
            <td>{DateTime.fromJSDate(vacation.startDate).toLocaleString()}</td>
            <td>{DateTime.fromJSDate(vacation.endDate).toLocaleString()}</td>
            <td className={styles[vacation.status]}>{vacation.status}</td>
            <td>
              {vacation.managerFirstName &&
                `${vacation.managerFirstName} ${vacation.mangerLastName}`}
            </td>
            <td>{vacation.note}</td>
            <td>
              <VacationRowOptions
                vacation={toSerializable(vacation)}
                employees={toSerializable(employees)}
                managers={toSerializable(managers)}
              />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}
