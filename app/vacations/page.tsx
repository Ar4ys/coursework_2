import {
  db,
  getEmployeesSelectOptions,
  getManagersSelectOptions,
  getProjectsSelectOptions,
} from '@/services/db'
import { toSerializable } from '@/services/form'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { VacationRowOptions } from './VacationRowOptions'

export default async function Reports() {
  const [employees, managers, vacations] = await Promise.all([
    getEmployeesSelectOptions(),
    getManagersSelectOptions(),
    await db
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
      .execute(),
  ])

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Category</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Manged by</th>
            <th>Note</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  )
}
