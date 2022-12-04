'use client'
import 'chart.js/auto'
import { Pie } from 'react-chartjs-2'
import { ChartData } from 'chart.js'

import { Text } from '@/components/Text'
import styles from './utils.module.css'
import { FC } from 'react'

interface AppChartData {
  title: string
  value: number
}

interface ChartsProps {
  totalProfit: number
  data: AppChartData[]
}

export const generateData = (data: AppChartData[]) =>
  ({
    labels: data.map(({ title }) => title),
    datasets: [
      {
        label: 'Profit ($)',
        data: data.map(({ value }) => value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } satisfies ChartData)

export const Charts: FC<ChartsProps> = ({ data, totalProfit }) => {
  return (
    <>
      <Text variant="h2" className={styles.header}>
        Profit by project:
      </Text>
      <div className={styles.chart}>
        <Pie data={generateData(data)} />
      </div>
      <Text variant="h2" className={styles.header}>
        Total profit: {totalProfit}$
      </Text>
    </>
  )
}
