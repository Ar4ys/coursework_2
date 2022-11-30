'use client'
import { FC, FormEventHandler, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Employees, Projects } from 'kysely-codegen'
import { Selectable } from 'kysely'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { ReportType } from '@/services/types'
import { formDataToObject } from '@/services/form'
import styles from './ReportForm.module.css'

interface ReportFormProps {
  authors: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
  projects: Array<Pick<Selectable<Projects>, 'id' | 'title'>>
}

const typeOptions = Object.values(ReportType).map(value => ({ value }))

export const ReportForm: FC<ReportFormProps> = ({ authors, projects }) => {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { refresh } = useRouter()
  const authorOptions = authors.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  const projectOptions = projects.map(({ id, title }) => ({
    title,
    value: id,
  }))

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async event => {
      event.preventDefault()
      setLoading(true)
      await ky.post('/api/report', { json: formDataToObject(event.currentTarget) })
      setLoading(false)
      formRef.current?.reset()
      refresh()
    },
    [refresh],
  )

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.left}>
        <div className={styles.top}>
          <Input name="date" label="Date" type="date" />
          <Select
            className={styles.flexGrow}
            name="employeeId"
            label="Author"
            placeholder="Select author..."
            options={authorOptions}
          />
          <Select
            className={styles.flexGrow}
            name="projectId"
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
        <Input name="note" label="Description" type="text" />
      </div>
      <div className={styles.right}>
        <Input
          inputClassName={styles.timeInput}
          inputMode="decimal"
          name="duration"
          label="Time"
          type="number"
          min={0}
        />
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
