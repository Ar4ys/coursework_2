import React from 'react'
import styles from './layout.module.css'
import { EmployeeForm } from './EmployeeForm'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <EmployeeForm />
      {children}
    </div>
  )
}
