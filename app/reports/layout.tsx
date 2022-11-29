import React from 'react'
import styles from './layout.module.css'
import { ReportForm } from './ReportForm'

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <ReportForm />
      {children}
    </div>
  )
}
