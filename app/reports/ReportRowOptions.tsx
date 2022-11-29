'use client'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { ReportForm } from './ReportForm'
import styles from './ReportRowOptions.module.css'

export const ReportRowOptions = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleOpenModal = useCallback(() => {
    setIsEditModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false)
  }, [])

  return (
    <>
      <Button variant="clear">
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
        <ReportForm />
      </Modal>
    </>
  )
}
