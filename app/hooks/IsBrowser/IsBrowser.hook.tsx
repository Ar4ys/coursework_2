import { useEffect, useState } from 'react'

/**
 * Use this hook to determine, whether we are rendering on a client or server.
 * When React is doing ssr - `useEffect` are not fired.
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  return isClient
}
