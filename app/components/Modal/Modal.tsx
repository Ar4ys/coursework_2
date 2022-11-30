'use client'
import clsx from 'clsx'
import { FC, useCallback, MouseEventHandler } from 'react'
import { createPortal } from 'react-dom'
import { useIsClient } from 'usehooks-ts'
import { Button } from '../Button'
import { Text } from '../Text'
import styles from './Modal.module.css'

interface ModalProps {
  children: React.ReactNode
  title?: string
  className?: string
  show?: boolean
  onClose?: () => void
}

export const Modal: FC<ModalProps> = ({ title, className, children, show, onClose }) => {
  const isClient = useIsClient()

  const handleCloseClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    e => {
      e.preventDefault()
      onClose?.()
    },
    [onClose],
  )

  const content = show && (
    <div className={styles.modalOverlay}>
      <div className={clsx(styles.modal, className)}>
        <div className={styles.modalHeader}>
          {title && <Text variant="h3">{title}</Text>}
          <div />
          <Button variant="clear" className={styles.modalX} onClick={handleCloseClick}>
            x
          </Button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )

  if (isClient) {
    const portalContainer = document.querySelector('#app-modal-container')
    if (!portalContainer)
      throw new Error('Modal container with id `app-modal-container` must be present')
    return createPortal(content, portalContainer)
  } else {
    return null
  }
}
