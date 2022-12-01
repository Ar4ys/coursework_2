'use client'
import { FC } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useEventListener } from 'usehooks-ts'

export const GlobalKeyboardListener: FC = () => {
  const { push } = useRouter()
  const pathname = usePathname()

  useEventListener('keyup', event => {
    if (!event.altKey || !event.shiftKey) return

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
      case 'KeyR':
        if (pathname?.endsWith('/search')) {
          push(pathname.replace('/search', ''))
        } else if (pathname) {
          push(`${pathname}/search`)
        }
        return
    }
  })

  return null
}
