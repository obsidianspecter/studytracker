"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Star, Zap, BookOpen, Clock, Calendar, FlameIcon as Fire } from "lucide-react"
import { motion } from "framer-motion"

interface Subject {
  id: string
  name: string
  completed: boolean
  notes: string
  date: string
  category: string
  priority: "low" | "medium" | "high"
  timeSpent: number
}

interface AchievementsProps {
  subjects: Subject[]
  streak: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: {
    current: number
    target: number
  }
}

export default function Achievements({ subjects, streak }: AchievementsProps) {
  const totalCompleted = subjects.filter((subject) => subject.completed).length
  const totalTimeSpent = subjects.reduce((total, subject) => total + subject.timeSpent, 0)
  const uniqueCategories = new Set(subjects.map((subject) => subject.category)).size

  const achievements: Achievement[] = [
    {
      id: "first-subject",
      name: "First Steps",
      description: "Complete your first subject",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      unlocked: totalCompleted >= 1,
    },
    {
      id: "five-subjects",
      name: "Getting Started",
      description: "Complete 5 subjects",
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      unlocked: totalCompleted >= 5,
      progress: {
        current: Math.min(totalCompleted, 5),
        target: 5,
      },
    },
    {
      id: "twenty-subjects",
      name: "Knowledge Seeker",
      description: "Complete 20 subjects",
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      unlocked: totalCompleted >= 20,
      progress: {
        current: Math.min(totalCompleted, 20),
        target: 20,
      },
    },
    {
      id: "three-day-streak",
      name: "Consistency",
      description: "Maintain a 3-day study streak",
      icon: <Fire className="h-5 w-5 text-orange-500" />,
      unlocked: streak >= 3,
      progress: {
        current: Math.min(streak, 3),
        target: 3,
      },
    },
    {
      id: "seven-day-streak",
      name: "Habit Builder",
      description: "Maintain a 7-day study streak",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      unlocked: streak >= 7,
      progress: {
        current: Math.min(streak, 7),
        target: 7,
      },
    },
    {
      id: "study-time",
      name: "Dedicated Learner",
      description: "Study for a total of 5 hours",
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      unlocked: totalTimeSpent >= 300,
      progress: {
        current: Math.min(totalTimeSpent, 300),
        target: 300,
      },
    },
    {
      id: "diverse-subjects",
      name: "Renaissance Scholar",
      description: "Study subjects from 5 different categories",
      icon: <Award className="h-5 w-5 text-red-500" />,
      unlocked: uniqueCategories >= 5,
      progress: {
        current: Math.min(uniqueCategories, 5),
        target: 5,
      },
    },
  ]

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Track your study milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">
              Unlocked ({unlockedAchievements.length}/{achievements.length})
            </h3>
            {unlockedAchievements.length === 0 ? (
              <p className="text-muted-foreground text-sm">You haven't unlocked any achievements yet. Keep studying!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border"
                  >
                    <div className="bg-background p-2 rounded-full">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-1">
                        <h4 className="font-medium text-sm sm:text-base">{achievement.name}</h4>
                        <Badge className="ml-0 sm:ml-2 bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                          Unlocked
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Locked</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg border opacity-70"
                >
                  <div className="bg-background p-2 rounded-full">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base">{achievement.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.progress && (
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(achievement.progress.current / achievement.progress.target) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.progress.current}/{achievement.progress.target}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

