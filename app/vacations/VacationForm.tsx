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
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { refresh } = useRouter()

  const employeeOptions = employees.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  const managerOptions = managers.map(({ id, firstName, lastName }) => ({
    title: `${firstName} ${lastName}`,
    value: id,
  }))

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async event => {
      event.preventDefault()
      setLoading(true)
      await ky('/api/vacation', {
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
          <Select
            className={styles.flexGrow}
            defaultValue={editing ? values.employeeId : undefined}
            name="employeeId"
            label="Employee"
            placeholder="Select employee..."
            options={employeeOptions}
            required
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
          <Input
            name="startDate"
            label="Start Date"
            type="date"
            defaultValue={editing ? DateTime.fromISO(values.startDate).toISODate() : undefined}
            required
          />
          <Input
            name="endDate"
            label="End Date"
            type="date"
            defaultValue={editing ? DateTime.fromISO(values.endDate).toISODate() : undefined}
            required
          />
          <Select
            className={styles.flexGrow}
            defaultValue={editing ? values.status : VacationStatus.Pending}
            name="status"
            label="Status"
            options={statusOptions}
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
        <Select
          className={styles.flexGrow}
          defaultValue={editing ? values.managerId : undefined}
          name="managerId"
          label="Managed By"
          placeholder="Select manager..."
          options={managerOptions}
        />
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
