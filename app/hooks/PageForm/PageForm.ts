import { FormEventHandler, useCallback, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DateTime } from 'luxon'
import { formDataToObject } from '@/services/form'

interface UsePageForm {
  editing: boolean | undefined | null
  values: Record<string, any> | undefined | null | false
  onSubmit: (values: Record<string, string>) => Promise<void> | void
}

export const usePageForm = ({ editing, values, onSubmit }: UsePageForm) => {
  const [isLoading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const formRef = useRef<HTMLFormElement>(null)
  const isSearching = pathname?.endsWith('/search')
  const { refresh, push } = useRouter()

  const getDefault = useCallback(
    (key: string) =>
      editing && values ? values[key] : isSearching ? searchParams.get(key) : undefined,
    [editing, isSearching, searchParams, values],
  )

  const getDefaultDate = useCallback(
    (key: string) => {
      const defaultValue = getDefault(key)
      if (defaultValue instanceof Date) return DateTime.fromJSDate(defaultValue)
      if (typeof defaultValue === 'string') return DateTime.fromISO(defaultValue)
      return isSearching ? undefined : DateTime.now()
    },
    [getDefault, isSearching],
  )

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async event => {
      event.preventDefault()
      if (isLoading) return

      setLoading(true)
      const formData = formDataToObject(event.currentTarget)

      if (isSearching) {
        const queryParams = new URLSearchParams(Object.entries(formData))
        push(pathname + '?' + queryParams.toString())
      } else {
        onSubmit?.(formData)
        formRef.current?.reset()
      }

      refresh()
      setLoading(false)
    },
    [isLoading, isSearching, refresh, push, pathname, onSubmit],
  )

  return {
    isLoading,
    isSearching,
    formRef,
    getDefault,
    getDefaultDate,
    handleSubmit,
  }
}
