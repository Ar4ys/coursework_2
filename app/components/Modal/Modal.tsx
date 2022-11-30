'use client'
import { FC, useCallback, MouseEventHandler, useRef } from 'react'
import { useIsClient, useOnClickOutside } from 'usehooks-ts'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

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

const noopFn = () => {}

export const Modal: FC<ModalProps> = ({ title, className, children, show, onClose = noopFn }) => {
  const isClient = useIsClient()
  const modalRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(modalRef, onClose)

  const content = show && (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={clsx(styles.modal, className)}>
        <div className={styles.modalHeader}>
          {title && <Text variant="h3">{title}</Text>}
          <div />
          <Button variant="clear" className={styles.modalX} onClick={onClose}>
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
