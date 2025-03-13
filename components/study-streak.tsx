"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

interface StudyStreakProps {
  streak: number
  totalTime: number
}

export default function StudyStreak({ streak, totalTime }: StudyStreakProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium mb-1">Current Streak</h3>
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <Flame className="h-5 w-5 mr-2 text-orange-500" />
                </motion.div>
                <span className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>{streak} days</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Today's Study Time</h3>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              <span className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>{formatTime(totalTime)}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-muted-foreground">
              {streak === 0
                ? "Complete at least one subject today to start your streak!"
                : streak === 1
                  ? "You've studied for 1 day in a row. Keep it up!"
                  : streak < 3
                    ? `You've studied for ${streak} days in a row. Good start!`
                    : streak < 7
                      ? `Great job! You've maintained your streak for ${streak} days.`
                      : `Amazing! ${streak} day streak - you're building a solid habit!`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

