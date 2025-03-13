"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface WeeklyData {
  date: string
  day: string
  progress: number
  total: number
  completed: number
}

interface WeeklyOverviewProps {
  data: WeeklyData[]
}

export default function WeeklyOverview({ data }: WeeklyOverviewProps) {
  const [chartHeight, setChartHeight] = useState(300)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 768px)")

  // Adjust chart height based on screen size
  useEffect(() => {
    if (isMobile) {
      setChartHeight(200)
    } else if (isTablet) {
      setChartHeight(250)
    } else {
      setChartHeight(300)
    }
  }, [isMobile, isTablet])

  // Format day labels for mobile
  const formatDay = (day: string) => {
    return isMobile ? day.substring(0, 1) : day
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>Your study progress for the past 7 days</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          config={{
            progress: {
              label: "Progress",
              color: "hsl(var(--chart-1))",
            },
          }}
          className={`h-[${chartHeight}px] w-full`}
        >
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: isMobile ? 10 : 30,
                left: isMobile ? 0 : 10,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatDay}
                tick={{ dy: 5 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                width={isMobile ? 30 : 40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="progress" radius={[4, 4, 0, 0]} className="fill-primary" maxBarSize={isMobile ? 20 : 40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Most Productive Day</h4>
            <p className="text-xl sm:text-2xl font-bold">
              {data.reduce((prev, current) => (prev.progress > current.progress ? prev : current)).day}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.reduce((prev, current) => (prev.progress > current.progress ? prev : current)).completed} subjects
              completed
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Weekly Average</h4>
            <p className="text-xl sm:text-2xl font-bold">
              {Math.round(data.reduce((sum, item) => sum + item.progress, 0) / data.length)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {data.reduce((sum, item) => sum + item.completed, 0)} subjects completed this week
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

