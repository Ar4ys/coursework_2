'use client'
import clsx from 'clsx'
import React, { FC } from 'react'
import styles from './Text.module.css'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'p'
}

export type TextProps = HeadingProps | ParagraphProps

export const Text: FC<TextProps> = ({ variant: Variant = 'p', className, ...props }) => {
  return <Variant className={clsx(styles[Variant], className)} {...props} />
}
