'use client'
import { FC, FormEventHandler, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { formDataToObject } from '@/services/form'
import styles from './EmployeeForm.module.css'
import { DateTime } from 'luxon'
import { Select } from '@/components/Select'
import { EmployeeRole } from '@/services/types'

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
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { refresh } = useRouter()

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async event => {
      event.preventDefault()
      setLoading(true)
      const data = formDataToObject(event.currentTarget)
      await ky('/api/employee', {
        method: editing ? 'put' : 'post',
        json: {
          ...data,
          techStack: (data.techStack as string).split(',').map(tech => tech.trim()),
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
      <div className={styles.row}>
        <Input
          className={styles.flexGrow}
          name="firstName"
          label="First Name"
          defaultValue={editing ? values.firstName : undefined}
          required
        />
        <Input
          className={styles.flexGrow}
          name="lastName"
          label="Last Name"
          defaultValue={editing ? values.lastName : undefined}
          required
        />
        <Select
          className={styles.flexGrow}
          defaultValue={editing ? values.role : undefined}
          name="role"
          label="Role"
          placeholder="Select role..."
          options={roleOptions}
          required
        />
        <Input
          className={styles.flexGrow}
          name="price"
          label="Price ($) per hour"
          inputMode="decimal"
          type="number"
          defaultValue={editing ? values.price : undefined}
          min={0}
          required
        />
      </div>
      <div className={styles.row}>
        <Input
          className={styles.flexGrow}
          name="techStack"
          label="Tech Stack"
          defaultValue={editing ? values.techStack.join(', ') : undefined}
        />
        <Button className={styles.button} type="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
