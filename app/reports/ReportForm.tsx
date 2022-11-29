'use client'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import styles from './ReportForm.module.css'

export const ReportForm = () => {
  return (
    <form className={styles.form}>
      <div className={styles.left}>
        <div className={styles.top}>
          <Input name="date" label="Date" type="date" />
          <Select
            className={styles.flexGrow}
            name="author"
            label="Author"
            options={[{ value: 'Test' }, { value: 'Test1' }]}
          />
          <Select
            className={styles.flexGrow}
            name="project"
            label="Project"
            options={[{ value: 'Test' }, { value: 'Test1' }]}
          />
          <Select
            className={styles.flexGrow}
            name="category"
            label="Category"
            options={[{ value: 'Test' }, { value: 'Test1' }]}
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
