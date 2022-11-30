import { db } from '@/services/db'
import React from 'react'
import styles from './layout.module.css'
import { ReportForm } from './ReportForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const [employees, projects] = await Promise.all([
    db.selectFrom('employees').select(['id', 'firstName', 'lastName']).execute(),
    db.selectFrom('projects').select(['id', 'title']).execute(),
  ])

  return (
    <div className={styles.wrapper}>
      <ReportForm authors={employees} projects={projects} />
      {children}
    </div>
  )
}
