import { DB } from 'kysely-codegen'
import { sql, WhereInterface } from 'kysely'
import { DateTime } from 'luxon'

import { NextPageProps } from '@/services/types'
import { db } from '@/services/db'
import { Charts } from './Charts'

export default async function ChartPage({ searchParams }: NextPageProps) {
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

  const [projects, [{ totalProfit }]] = await Promise.all([
    withDate(
      db
        .selectFrom('projects')
        .innerJoin('reports', 'reports.projectId', 'projects.id')
        .innerJoin('employees', 'employees.id', 'reports.employeeId')
        .selectAll('projects')
        .select(['title', sql<number>`SUM(reports.duration * employees.price)`.as('value')])
        .groupBy(['projects.id']),
    ).execute(),
    withDate(
      db
        .selectFrom('reports')
        .innerJoin('employees', 'employees.id', 'reports.employeeId')
        .select(sql<number>`SUM(reports.duration * employees.price)`.as('totalProfit')),
    ).execute(),
  ])

  return (
    <>
      <Charts data={projects} totalProfit={totalProfit} />
    </>
  )
}
