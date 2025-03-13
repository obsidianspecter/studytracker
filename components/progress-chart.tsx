"use client"

import { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProgressChartProps {
  progress: number
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  const [animate, setAnimate] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Today's Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className={isMobile ? "w-32 h-32" : "w-40 h-40"}>
            <CircularProgressbar
              value={animate ? progress : 0}
              text={`${progress}%`}
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: "round",
                textSize: "16px",
                pathTransitionDuration: 1,
                pathColor: `hsl(var(--primary))`,
                textColor: "hsl(var(--foreground))",
                trailColor: "hsl(var(--muted))",
                backgroundColor: "hsl(var(--background))",
              })}
            />
          </div>
          <div className="flex-1">
            <div className="space-y-3 md:space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Completion Status</h3>
                <div className="text-xl md:text-2xl font-bold">
                  {progress === 0
                    ? "Not Started"
                    : progress < 25
                      ? "Just Beginning"
                      : progress < 50
                        ? "Making Progress"
                        : progress < 75
                          ? "Well Underway"
                          : progress < 100
                            ? "Almost There"
                            : "Completed!"}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Motivation</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {progress === 0
                    ? "Start studying to track your progress!"
                    : progress === 100
                      ? "Great job! You've completed all subjects for today."
                      : progress > 75
                        ? "You're doing amazing! Just a little more to go."
                        : progress > 50
                          ? "You're more than halfway there. Keep it up!"
                          : progress > 25
                            ? "Good progress so far. Keep the momentum going!"
                            : "You've made a start. Keep going!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

