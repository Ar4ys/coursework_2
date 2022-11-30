'use client'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import ky from 'ky'
import { Selectable } from 'kysely'
import { Clients, Projects } from 'kysely-codegen'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useState } from 'react'
import { ProjectForm } from './ProjectForm'
import styles from './ProjectRowOptions.module.css'

interface ProjectRowOptionsProps {
  clients: Array<Pick<Selectable<Clients>, 'id' | 'firstName' | 'lastName'>>
  project: Selectable<Projects>
}

export const ProjectRowOptions: FC<ProjectRowOptionsProps> = ({ clients, project }) => {
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
    await ky.delete('/api/project', { searchParams: { id: project.id } })
    refresh()
  }, [refresh, project?.id])

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
        <ProjectForm clients={clients} values={project} onSubmit={handleCloseModal} editing />
      </Modal>
    </>
  )
}
