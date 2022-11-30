import { db, getEmployeesSelectOptions, getProjectsSelectOptions } from '@/services/db'
import { toSerializable } from '@/services/form'
import { sql } from 'kysely'
import { DateTime } from 'luxon'
import styles from './page.module.css'
import { EmployeeRowOptions } from './EmployeeRowOptions'

export default async function Reports() {
  const employee = await db
    .selectFrom('employees')
    .leftJoin('reports', 'reports.employeeId', 'employees.id')
    .leftJoin('projects', 'projects.id', 'reports.projectId')
    .selectAll('employees')
    .select(sql<string[]>`array_agg(distinct projects.title)`.as('projects'))
    .groupBy('employees.id')
    .execute()

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Price</th>
            <th>Tech Stack</th>
            <th>Projects</th>
            <th>Since</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {employee.map(employee => (
            <tr key={employee.id}>
              <td>{`${employee.firstName} ${employee.lastName}`}</td>
              <td>{employee.role}</td>
              <td>{employee.price}</td>
              <td>{employee.techStack.join(', ')}</td>
              <td>{employee.projects.join(', ')}</td>
              <td>{DateTime.fromJSDate(employee.createdAt).toLocaleString()}</td>
              <td>
                <EmployeeRowOptions employee={toSerializable(employee)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
