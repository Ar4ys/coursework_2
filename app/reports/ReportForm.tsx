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
import { DateTime } from 'luxon'

interface ReportFormCreate {
  editing?: false
  values?: undefined
}

interface ReportFormEdit {
  editing: true
  values: Record<string, any>
}

type ReportFormProps = (ReportFormEdit | ReportFormCreate) & {
  authors: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
  projects: Array<Pick<Selectable<Projects>, 'id' | 'title'>>
  onSubmit?: () => void
}

const typeOptions = Object.values(ReportType).map(value => ({ value }))

export const ReportForm: FC<ReportFormProps> = ({
  authors,
  projects,
  editing,
  values,
  onSubmit,
}) => {
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
      await ky('/api/report', {
        method: editing ? 'put' : 'post',
        json: {
          ...formDataToObject(event.currentTarget),
          id: editing ? values.id : undefined,
        },
      })
      setLoading(false)
      formRef.current?.reset()
      refresh()
      onSubmit?.()
    },
    [editing, values?.id, refresh, onSubmit],
  )

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.left}>
        <div className={styles.top}>
          <Input
            name="date"
            label="Date"
            type="date"
            defaultValue={editing ? DateTime.fromISO(values.date).toISODate() : undefined}
            required
          />
          <Select
            className={styles.flexGrow}
            defaultValue={editing ? values.employeeId : undefined}
            name="employeeId"
            label="Author"
            placeholder="Select author..."
            options={authorOptions}
            required
          />
          <Select
            className={styles.flexGrow}
            defaultValue={editing ? values.projectId : undefined}
            name="projectId"
            label="Project"
            placeholder="Select project..."
            options={projectOptions}
          />
          <Select
            className={styles.flexGrow}
            defaultValue={editing ? values.type : undefined}
            name="type"
            label="Category"
            placeholder="Select category..."
            options={typeOptions}
            required
          />
        </div>
        <Input
          name="note"
          label="Description"
          type="text"
          defaultValue={editing ? values.note : undefined}
        />
      </div>
      <div className={styles.right}>
        <Input
          inputClassName={styles.timeInput}
          defaultValue={editing ? values.duration : undefined}
          inputMode="decimal"
          name="duration"
          label="Time"
          type="number"
          min={0}
          required
        />
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
