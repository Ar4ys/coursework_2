'use client'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Employees, Projects } from 'kysely-codegen'
import { Selectable } from 'kysely'
import { FC } from 'react'
import styles from './ReportForm.module.css'
import { ReportType } from '@/services/types'

interface ReportFormProps {
  authors: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
  projects: Array<Pick<Selectable<Projects>, 'id' | 'title'>>
}

const typeOptions = Object.values(ReportType).map(value => ({ value }))

export const ReportForm: FC<ReportFormProps> = ({ authors, projects }) => {
  const authorOptions = authors.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  const projectOptions = projects.map(({ id, title }) => ({
    title,
    value: id,
  }))

  return (
    <form className={styles.form}>
      <div className={styles.left}>
        <div className={styles.top}>
          <Input name="date" label="Date" type="date" />
          <Select
            className={styles.flexGrow}
            name="author"
            label="Author"
            placeholder="Select author..."
            options={authorOptions}
          />
          <Select
            className={styles.flexGrow}
            name="project"
            label="Project"
            placeholder="Select project..."
            options={projectOptions}
          />
          <Select
            className={styles.flexGrow}
            name="type"
            label="Category"
            placeholder="Select category..."
            options={typeOptions}
          />
        </div>
        <Input name="description" label="Description" type="text" />
      </div>
      <div className={styles.right}>
        <Input
          inputClassName={styles.timeInput}
          inputMode="decimal"
          name="time"
          label="Time"
          type="number"
          min={0}
        />
        <Button type="reset">Test</Button>
      </div>
    </form>
  )
}
