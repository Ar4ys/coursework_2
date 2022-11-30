import { Table } from '@/components/Table'
import { db, getEmployeesSelectOptions, getManagersSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { VacationRowOptions } from './VacationRowOptions'

export default async function VacationsPage() {
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
      <Table
        header={['Employee', 'Category', 'Start', 'End', 'Status', 'Manged', 'Note', 'Options']}
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
