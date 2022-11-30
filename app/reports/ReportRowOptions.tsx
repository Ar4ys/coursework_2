'use client'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import ky from 'ky'
import { Selectable } from 'kysely'
import { Employees, Projects, Reports } from 'kysely-codegen'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'
import { ReportForm } from './ReportForm'
import styles from './ReportRowOptions.module.css'

interface ReportRowOptionsProps {
  report: Selectable<Reports>
  authors: Array<Pick<Selectable<Employees>, 'id' | 'firstName' | 'lastName'>>
  projects: Array<Pick<Selectable<Projects>, 'id' | 'title'>>
}

export const ReportRowOptions: FC<ReportRowOptionsProps> = ({ report, authors, projects }) => {
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
    await ky.delete('/api/report', { searchParams: { id: report.id } })
    refresh()
  }, [refresh, report?.id])

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
        <ReportForm
          authors={authors}
          projects={projects}
          values={report}
          onSubmit={handleCloseModal}
          editing
        />
      </Modal>
    </>
  )
}
