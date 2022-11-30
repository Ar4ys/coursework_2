'use client'
import { FC, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Employees, Vacations } from 'kysely-codegen'
import { Selectable } from 'kysely'
import ky from 'ky'

import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { VacationForm } from './VacationForm'
import styles from './VacationRowOptions.module.css'

interface VacationRowOptionsProps {
  vacation: Selectable<Vacations>
  employees: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
  managers: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
}

export const VacationRowOptions: FC<VacationRowOptionsProps> = ({
  vacation,
  employees,
  managers,
}) => {
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
    await ky.delete('/api/vacation', { searchParams: { id: vacation.id } })
    refresh()
  }, [refresh, vacation?.id])

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
        title="Edit work report"
        show={isEditModalOpen}
        onClose={handleCloseModal}
      >
        <VacationForm
          employees={employees}
          managers={managers}
          values={vacation}
          onSubmit={handleCloseModal}
          editing
        />
      </Modal>
    </>
  )
}
