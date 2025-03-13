"use client"

import { useState, useEffect } from "react"
import { Plus, BarChart, Calendar, Award, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SubjectItem from "./subject-item"
import ProgressChart from "./progress-chart"
import WeeklyOverview from "./weekly-overview"
import StudyStreak from "./study-streak"
import Achievements from "./achievements"
import ThemeToggle from "./theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

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

export default function StudyTracker() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubject, setNewSubject] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("today")
  const { toast } = useToast()
  const today = new Date().toISOString().split("T")[0]

  // Load subjects from local storage on component mount
  useEffect(() => {
    const storedSubjects = localStorage.getItem("studySubjects")
    if (storedSubjects) {
      const parsedSubjects = JSON.parse(storedSubjects)
      setSubjects(parsedSubjects)
    }

    // Check for dark mode preference from system
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedMode = localStorage.getItem("darkMode")

    // Use saved preference if available, otherwise use system preference
    const darkMode = savedMode !== null ? savedMode === "true" : prefersDark
    setIsDarkMode(darkMode)

    if (darkMode) {
      document.documentElement.classList.add("dark")
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("darkMode") === null) {
        setIsDarkMode(e.matches)
        if (e.matches) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Save subjects to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("studySubjects", JSON.stringify(subjects))
  }, [subjects])

  // Toggle dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString())

    // Add transition class for smooth theme change
    document.documentElement.classList.add("theme-transition")

    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Remove transition class after transition completes
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 300)

    return () => clearTimeout(timeout)
  }, [isDarkMode])

  const addSubject = () => {
    if (newSubject.trim() === "") {
      toast({
        title: "Subject name required",
        description: "Please enter a subject name",
        variant: "destructive",
      })
      return
    }

    const newSubjectItem: Subject = {
      id: Date.now().toString(),
      name: newSubject,
      completed: false,
      notes: "",
      date: today,
      category: "General",
      priority: "medium",
      timeSpent: 0,
    }

    setSubjects([...subjects, newSubjectItem])
    setNewSubject("")

    toast({
      title: "Subject added",
      description: `${newSubject} has been added to your study list`,
    })
  }

  const toggleComplete = (id: string) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === id) {
          const newStatus = !subject.completed

          // Show toast based on completion status
          if (newStatus) {
            toast({
              title: "Subject completed! 🎉",
              description: `Great job completing ${subject.name}!`,
              variant: "default",
            })
          }

          return { ...subject, completed: newStatus }
        }
        return subject
      }),
    )
  }

  const updateNotes = (id: string, notes: string) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, notes } : subject)))
  }

  const updateCategory = (id: string, category: string) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, category } : subject)))
  }

  const updatePriority = (id: string, priority: "low" | "medium" | "high") => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, priority } : subject)))
  }

  const updateTimeSpent = (id: string, timeSpent: number) => {
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, timeSpent } : subject)))
  }

  const deleteSubject = (id: string) => {
    const subjectToDelete = subjects.find((subject) => subject.id === id)
    setSubjects(subjects.filter((subject) => subject.id !== id))

    if (subjectToDelete) {
      toast({
        title: "Subject deleted",
        description: `${subjectToDelete.name} has been removed`,
        variant: "default",
      })
    }
  }

  const calculateProgress = () => {
    const todaysSubjects = subjects.filter((subject) => subject.date === today)
    if (todaysSubjects.length === 0) return 0
    const completedCount = todaysSubjects.filter((subject) => subject.completed).length
    return Math.round((completedCount / todaysSubjects.length) * 100)
  }

  const getCategories = () => {
    const categories = new Set(subjects.map((subject) => subject.category))
    return Array.from(categories)
  }

  const getStreak = () => {
    const dates = subjects
      .filter((subject) => subject.completed)
      .map((subject) => subject.date)
      .sort()

    if (dates.length === 0) return 0

    // Check if there's a completed subject today
    const hasCompletedToday = dates.includes(today)
    if (!hasCompletedToday) return 0

    let streak = 1
    const currentDate = new Date(today)
    currentDate.setDate(currentDate.getDate() - 1)

    while (true) {
      const dateString = currentDate.toISOString().split("T")[0]
      if (dates.includes(dateString)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const getWeeklyData = () => {
    const weeklyData = []
    const currentDate = new Date(today)

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const daySubjects = subjects.filter((subject) => subject.date === dateString)
      const total = daySubjects.length
      const completed = daySubjects.filter((subject) => subject.completed).length
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0

      weeklyData.push({
        date: dateString,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        progress,
        total,
        completed,
      })
    }

    return weeklyData
  }

  const getTotalStudyTime = () => {
    return subjects.filter((subject) => subject.date === today).reduce((total, subject) => total + subject.timeSpent, 0)
  }

  const filteredSubjects = subjects.filter((subject) => {
    const matchesDate = activeTab === "today" ? subject.date === today : true

    const matchesCategory = selectedCategory === "all" ? true : subject.category === selectedCategory

    const matchesPriority = selectedPriority === "all" ? true : subject.priority === selectedPriority

    return matchesDate && matchesCategory && matchesPriority
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold hidden sm:block">Daily Study Tracker</h2>
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>
      </div>

      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Today</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">All Subjects</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-1 md:col-span-2"
            >
              <ProgressChart progress={calculateProgress()} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StudyStreak streak={getStreak()} totalTime={getTotalStudyTime()} />
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
            <Input
              type="text"
              placeholder="Add a new subject..."
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSubject()
                }
              }}
              className="w-full"
            />
            <Button onClick={addSubject} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence>
            <div className="space-y-3">
              {filteredSubjects.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-muted-foreground py-8"
                >
                  No subjects found. Add a subject to get started!
                </motion.p>
              ) : (
                filteredSubjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SubjectItem
                      subject={subject}
                      onToggleComplete={toggleComplete}
                      onUpdateNotes={updateNotes}
                      onUpdateCategory={updateCategory}
                      onUpdatePriority={updatePriority}
                      onUpdateTimeSpent={updateTimeSpent}
                      onDelete={deleteSubject}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <WeeklyOverview data={getWeeklyData()} />
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <Achievements subjects={subjects} streak={getStreak()} />
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence>
            <div className="space-y-3">
              {filteredSubjects.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-muted-foreground py-8"
                >
                  No subjects found with the selected filters.
                </motion.p>
              ) : (
                filteredSubjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SubjectItem
                      subject={subject}
                      onToggleComplete={toggleComplete}
                      onUpdateNotes={updateNotes}
                      onUpdateCategory={updateCategory}
                      onUpdatePriority={updatePriority}
                      onUpdateTimeSpent={updateTimeSpent}
                      onDelete={deleteSubject}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}

