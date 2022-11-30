'use client'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import ky from 'ky'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'
import { ReportForm, ReportFormProps } from './ReportForm'
import styles from './ReportRowOptions.module.css'

interface ReportRowOptionsProps {
  reportId: string
  formProps: ReportFormProps
}

export const ReportRowOptions: FC<ReportRowOptionsProps> = ({ reportId, formProps }) => {
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
    await ky.delete('/api/report', { searchParams: { id: reportId } })
    refresh()
  }, [refresh, reportId])

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
        <ReportForm {...formProps} />
      </Modal>
    </>
  )
}
