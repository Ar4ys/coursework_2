'use client'
import { FC, useCallback } from 'react'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { EmployeeRole } from '@/services/types'
import { usePageForm } from '@/hooks/PageForm'
import styles from './EmployeeForm.module.css'

interface EmployeeFormCreate {
  editing?: false
  values?: undefined
}

interface EmployeeFormEdit {
  editing: true
  values: Record<string, any>
}

type EmployeeFormProps = (EmployeeFormEdit | EmployeeFormCreate) & {
  onSubmit?: () => void
}

const roleOptions = Object.values(EmployeeRole).map(value => ({ value }))

export const EmployeeForm: FC<EmployeeFormProps> = ({ editing, values, onSubmit }) => {
  const { isLoading, isSearching, formRef, getDefault, getDefaultArray, handleSubmit } =
    usePageForm({
      editing,
      values,
      onSubmit: useCallback(
        async newValues => {
          await ky('/api/employee', {
            method: editing ? 'put' : 'post',
            json: {
              ...newValues,
              techStack: newValues.techStack.split(',').map(tech => tech.trim()),
              id: editing ? values.id : undefined,
            },
          })
          onSubmit?.()
        },
        [editing, onSubmit, values?.id],
      ),
    })

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <Input
          className={styles.flexGrow}
          name="firstName"
          label="First Name"
          defaultValue={getDefault('firstName')}
          required={!isSearching}
        />
        <Input
          className={styles.flexGrow}
          name="lastName"
          label="Last Name"
          defaultValue={getDefault('lastName')}
          required={!isSearching}
        />
        <Select
          className={styles.flexGrow}
          defaultValue={getDefault('role')}
          name="role"
          label="Role"
          placeholder="Select role..."
          options={roleOptions}
          required={!isSearching}
          allowEmpty={isSearching}
        />
        <Input
          className={styles.flexGrow}
          name="price"
          label="Price ($) per hour"
          inputMode="decimal"
          type="number"
          defaultValue={getDefault('price')}
          min={0}
          required={!isSearching}
        />
      </div>
      <div className={styles.row}>
        <Input
          className={styles.flexGrow}
          name="techStack"
          label="Tech Stack"
          defaultValue={getDefaultArray('techStack').join(', ')}
        />
        <Button className={styles.button} type="submit" loading={isLoading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
