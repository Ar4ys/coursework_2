'use client'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import ky from 'ky'
import { Selectable } from 'kysely'
import { Clients } from 'kysely-codegen'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'
import { ClientForm } from './ClientForm'
import styles from './ClientRowOptions.module.css'

interface ClientRowOptionsProps {
  client: Selectable<Clients>
}

export const ClientRowOptions: FC<ClientRowOptionsProps> = ({ client }) => {
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
    await ky.delete('/api/client', { searchParams: { id: client.id } })
    refresh()
  }, [refresh, client?.id])

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
        <ClientForm values={client} onSubmit={handleCloseModal} editing />
      </Modal>
    </>
  )
}
