'use client'
import { FC, FormEventHandler, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Employees, Projects } from 'kysely-codegen'
import { Selectable } from 'kysely'
import { DateTime } from 'luxon'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { ReportType } from '@/services/types'
import { usePageForm } from '@/hooks/PageForm'
import styles from './ReportForm.module.css'

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
  const { isLoading, isSearching, formRef, getDefault, getDefaultDate, handleSubmit } = usePageForm(
    {
      editing,
      values,
      onSubmit: useCallback(
        async newValues => {
          await ky('/api/report', {
            method: editing ? 'put' : 'post',
            json: {
              ...newValues,
              id: editing ? values.id : undefined,
            },
          })
          onSubmit?.()
        },
        [editing, onSubmit, values?.id],
      ),
    },
  )

  const authorOptions = authors.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  const projectOptions = projects.map(({ id, title }) => ({
    title,
    value: id,
  }))

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.left}>
        <div className={styles.top}>
          <Input
            name="date"
            label="Date"
            type="date"
            defaultValue={getDefaultDate('date')?.toISODate()}
            required={!isSearching}
          />
          <Select
            className={styles.flexGrow}
            defaultValue={getDefault('employeeId')}
            name="employeeId"
            label="Author"
            placeholder="Select author..."
            options={authorOptions}
            required={!isSearching}
          />
          <Select
            className={styles.flexGrow}
            defaultValue={getDefault('projectId')}
            name="projectId"
            label="Project"
            placeholder="Select project..."
            options={projectOptions}
          />
          <Select
            className={styles.flexGrow}
            defaultValue={getDefault('type')}
            name="type"
            label="Category"
            placeholder="Select category..."
            options={typeOptions}
            required={!isSearching}
          />
        </div>
        <Input name="note" label="Description" type="text" defaultValue={getDefault('note')} />
      </div>
      <div className={styles.right}>
        <Input
          inputClassName={styles.timeInput}
          defaultValue={getDefault('duration')}
          inputMode="decimal"
          name="duration"
          label="Time"
          type="number"
          min={0}
          required={!isSearching}
        />
        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
