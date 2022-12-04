import { sql, WhereInterface } from 'kysely'
import { db } from '@/services/db'
import { Table } from '@/components/Table'
import { Text } from '@/components/Text'
import styles from './page.module.css'
import { NextPageProps } from '@/services/types'
import { DB } from 'kysely-codegen'
import { DateTime } from 'luxon'

export default async function TablePage({ searchParams }: NextPageProps) {
  const { from, to } = searchParams
  const withDate = <T extends WhereInterface<DB, keyof DB>>(dbRequest: T) => {
    let request
    if (from) {
      const date = DateTime.fromISO(from)
      if (date.isValid) request = dbRequest.where('reports.date', '>=', date.toJSDate())
    }

    if (to) {
      const date = DateTime.fromISO(to)
      if (date.isValid) request = dbRequest.where('reports.date', '<=', date.toJSDate())
    }

    return (request ?? dbRequest) as T
  }
  const [employees, projects, [{ profit }]] = await Promise.all([
    withDate(
      db
        .selectFrom('employees')
        .innerJoin('reports', 'reports.employeeId', 'employees.id')
        .innerJoin('projects', 'projects.id', 'reports.projectId')
        .selectAll('employees')
        .select([
          sql<string>`concat(first_name, ' ', last_name)`.as('name'),
          sql<string[]>`array_agg(distinct projects.title)`.as('projects'),
          sql<number>`SUM(reports.duration)`.as('hours'),
          sql<number>`SUM(reports.duration) * employees.price`.as('profit'),
        ])
        .groupBy('employees.id'),
    ).execute(),
    withDate(
      db
        .selectFrom('projects')
        .innerJoin('clients', 'clients.id', 'projects.clientId')
        .innerJoin('reports', 'reports.projectId', 'projects.id')
        .innerJoin('employees', 'employees.id', 'reports.employeeId')
        .selectAll('projects')
        .select([
          sql<number>`SUM(reports.duration)`.as('hours'),
          sql<number>`SUM(reports.duration * employees.price)`.as('profit'),
          sql<string>`concat(clients.first_name, ' ', clients.last_name)`.as('clientName'),
          sql<
            string[]
          >`array_agg(distinct concat(employees.first_name, ' ', employees.last_name))`.as(
            'employees',
          ),
        ])
        .groupBy(['projects.id', 'clients.firstName', 'clients.lastName']),
    ).execute(),
    withDate(
      db
        .selectFrom('reports')
        .innerJoin('employees', 'employees.id', 'reports.employeeId')
        .select(sql<number>`SUM(reports.duration * employees.price)`.as('profit')),
    ).execute(),
  ])

  return (
    <>
      <Text variant="h2" className={styles.header}>
        Profit by employee:
      </Text>
      <Table header={['Employee', 'Role', 'Projects', 'Price', 'Hours', 'Profit']}>
        {employees.map(employee => (
          <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>{employee.role}</td>
            <td>{employee.projects.join(', ')}</td>
            <td>{employee.price}$</td>
            <td>{employee.hours}</td>
            <td>{employee.profit}$</td>
          </tr>
        ))}
      </Table>
      <Text variant="h2" className={styles.header}>
        Profit by project:
      </Text>
      <Table header={['Title', 'Client', 'Employees', 'Hours', 'Profit']}>
        {projects.map(project => (
          <tr key={project.id}>
            <td>{project.title}</td>
            <td>{project.clientName}</td>
            <td>{project.employees.join(', ')}</td>
            <td>{project.hours}</td>
            <td>{project.profit}$</td>
          </tr>
        ))}
      </Table>
      <Text variant="h2" className={styles.header}>
        Total profit: {profit}$
      </Text>
    </>
  )
}
