'use client'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useEventListener } from 'usehooks-ts'

export const GlobalKeyboardListener: FC = () => {
  const { push } = useRouter()

  useEventListener('keyup', event => {
    if (!event.altKey || !event.shiftKey) return
    console.log(event.code)

    switch (event.code) {
      case 'Digit1':
        push('/reports')
        return
      case 'Digit2':
        push('/vacations')
        return
      case 'Digit3':
        push('/clients')
        return
      case 'Digit4':
        push('/employees')
        return
      case 'Digit5':
        push('/projects')
        return
      case 'Digit6':
        // TODO
        push('/reports')
        return
    }
  })

  return null
}
