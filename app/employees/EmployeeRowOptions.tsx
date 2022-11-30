'use client'
import { FC, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Selectable } from 'kysely'
import { Employees } from 'kysely-codegen'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { EmployeeForm } from './EmployeeForm'
import styles from './EmployeeRowOptions.module.css'

interface EmployeeRowOptionsProps {
  employee: Selectable<Employees>
}

export const EmployeeRowOptions: FC<EmployeeRowOptionsProps> = ({ employee }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { refresh } = useRouter()

  const handleOpenModal = useCallback(() => {
    setIsEditModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false)
  }, [])

  const handleDelete = useCallback(async () => {
    setDeleteLoading(true)
    await ky.delete('/api/employee', { searchParams: { id: employee.id } })
    refresh()
  }, [refresh, employee?.id])

  return (
    <>
      <Button variant="clear" loading={deleteLoading} onClick={handleDelete}>
        <Image src="/delete.svg" alt="Delete" width={24} height={24} />
      </Button>
      <Button variant="clear" onClick={handleOpenModal}>
        <Image src="/pencil.svg" alt="Edit" width={24} height={24} />
      </Button>
      <Modal
        className={styles.modal}
        title="Edit client"
        show={isEditModalOpen}
        onClose={handleCloseModal}
      >
        <EmployeeForm values={employee} onSubmit={handleCloseModal} editing />
      </Modal>
    </>
  )
}
