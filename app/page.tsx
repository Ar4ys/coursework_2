import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default function Home(): ReactNode {
  redirect('/reports')
}
