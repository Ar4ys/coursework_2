'use client'
import { FC, FormEventHandler, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Employees } from 'kysely-codegen'
import { Selectable } from 'kysely'
import { DateTime } from 'luxon'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { VacationStatus, VacationType } from '@/services/types'
import { formDataToObject } from '@/services/form'
import styles from './VacationForm.module.css'
import { usePageForm } from '@/hooks/PageForm'

interface VacationFormCreate {
  editing?: false
  values?: undefined
}

interface VacationFormEdit {
  editing: true
  values: Record<string, any>
}

type VacationFormProps = (VacationFormEdit | VacationFormCreate) & {
  employees: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
  managers: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
  onSubmit?: () => void
}

const typeOptions = Object.values(VacationType).map(value => ({ value }))
const statusOptions = Object.values(VacationStatus).map(value => ({ value }))

export const VacationForm: FC<VacationFormProps> = ({
  employees,
  managers,
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
          await ky('/api/vacation', {
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

  const employeeOptions = employees.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  const managerOptions = managers.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.left}>
        <div className={styles.top}>
          <Select
            className={styles.flexGrow}
            defaultValue={getDefault('employeeId')}
            name="employeeId"
            label="Employee"
            placeholder="Select employee..."
            options={employeeOptions}
            required={!isSearching}
            allowEmpty={isSearching}
          />
          <Select
            className={styles.flexGrow}
            defaultValue={getDefault('type')}
            name="type"
            label="Category"
            placeholder="Select category..."
            options={typeOptions}
            required={!isSearching}
            allowEmpty={isSearching}
          />
          <Input
            name="startDate"
            label="Start Date"
            type="date"
            defaultValue={getDefaultDate('startDate')?.toISODate()}
            required={!isSearching}
          />
          <Input
            name="endDate"
            label="End Date"
            type="date"
            defaultValue={getDefaultDate('endDate')?.toISODate()}
            required={!isSearching}
          />
          <Select
            className={styles.flexGrow}
            defaultValue={
              getDefault('status') ?? (isSearching ? undefined : VacationStatus.Pending)
            }
            name="status"
            label="Status"
            placeholder="Select status..."
            options={statusOptions}
            required={!isSearching}
            allowEmpty={isSearching}
          />
        </div>
        <Input name="note" label="Description" type="text" defaultValue={getDefault('note')} />
      </div>
      <div className={styles.right}>
        <Select
          className={styles.flexGrow}
          defaultValue={getDefault('managerId')}
          name="managerId"
          label="Managed By"
          placeholder="Select manager..."
          options={managerOptions}
          allowEmpty={isSearching}
        />
        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
