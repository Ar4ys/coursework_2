import { sql } from 'kysely'
import { DateTime } from 'luxon'

import { db } from '@/services/db'
import { toSerializable } from '@/services/form'
import { Table } from '@/components/Table'
import { EmployeeRole, NextPageProps } from '@/services/types'
import { EmployeeRowOptions } from './EmployeeRowOptions'
import styles from './page.module.css'

export default async function EmployeesPage({ searchParams }: NextPageProps) {
  const { firstName, lastName, role, price, techStack } = searchParams

  let request = db
    .selectFrom('employees')
    .leftJoin('reports', 'reports.employeeId', 'employees.id')
    .leftJoin('projects', 'projects.id', 'reports.projectId')
    .selectAll('employees')
    .select(sql<string[]>`array_agg(distinct projects.title)`.as('projects'))
    .groupBy('employees.id')

  if (firstName) request = request.where('employees.firstName', '=', firstName)
  if (lastName) request = request.where('employees.lastName', '=', lastName)
  if (role) request = request.where('employees.role', '=', role as EmployeeRole)
  if (price) request = request.where('employees.price', '=', Number(price))
  if (techStack)
    request = request.where(
      'employees.techStack',
      '@>',
      sql`array[${techStack
        .split(',')
        .map(tech => tech.trim())
        .toString()}]::varchar[]`,
    )

  const employees = await request.execute()

  return (
    <div className={styles.container}>
      <Table header={['Name', 'Role', 'Price', 'Tech Stack', 'Projects', 'Since', 'Options']}>
        {employees.map(employee => (
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
      </Table>
    </div>
  )
}
