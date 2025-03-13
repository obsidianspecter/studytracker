"use client"

import { useState, useRef, useEffect } from "react"
import { Trash, ChevronDown, ChevronUp, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

interface SubjectItemProps {
  subject: Subject
  onToggleComplete: (id: string) => void
  onUpdateNotes: (id: string, notes: string) => void
  onUpdateCategory: (id: string, category: string) => void
  onUpdatePriority: (id: string, priority: "low" | "medium" | "high") => void
  onUpdateTimeSpent: (id: string, timeSpent: number) => void
  onDelete: (id: string) => void
}

export default function SubjectItem({
  subject,
  onToggleComplete,
  onUpdateNotes,
  onUpdateCategory,
  onUpdatePriority,
  onUpdateTimeSpent,
  onDelete,
}: SubjectItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerValue, setTimerValue] = useState(0)
  const [newCategory, setNewCategory] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerValue((prev) => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning])

  const handleTimerToggle = () => {
    if (isTimerRunning) {
      // Save the time spent when stopping the timer
      onUpdateTimeSpent(subject.id, subject.timeSpent + Math.floor(timerValue / 60))
      setTimerValue(0)
    }
    setIsTimerRunning(!isTimerRunning)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatTotalTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20 dark:bg-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 dark:bg-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20 dark:bg-green-500/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  const addNewCategory = () => {
    if (newCategory.trim()) {
      onUpdateCategory(subject.id, newCategory.trim())
      setNewCategory("")
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`border rounded-lg p-4 transition-colors ${
        subject.completed ? "bg-primary/10 border-primary/20 dark:bg-primary/20" : "bg-card border-border"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`subject-${subject.id}`}
            checked={subject.completed}
            onCheckedChange={() => onToggleComplete(subject.id)}
          />
          <label
            htmlFor={`subject-${subject.id}`}
            className={`font-medium text-sm sm:text-base ${
              subject.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {subject.name}
          </label>
          <Badge variant="outline" className={getPriorityColor(subject.priority)}>
            {subject.priority}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/20 text-xs"
          >
            {subject.category}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => onDelete(subject.id)}>
            <Trash className="h-4 w-4 text-destructive" />
            <span className="sr-only">Delete subject</span>
          </Button>
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="mt-3 flex justify-end">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle notes</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-1 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="flex gap-2">
                <Select value={subject.category} onValueChange={(value) => onUpdateCategory(subject.id, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Math">Math</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Language">Language</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-w-[280px] sm:w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Add New Category</h4>
                      <div className="flex gap-2">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="New category name"
                        />
                        <Button onClick={addNewCategory}>Add</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select
                value={subject.priority}
                onValueChange={(value: "low" | "medium" | "high") => onUpdatePriority(subject.id, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor={`notes-${subject.id}`} className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id={`notes-${subject.id}`}
              placeholder="Add your notes here..."
              value={subject.notes}
              onChange={(e) => onUpdateNotes(subject.id, e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Study Time</label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTotalTime(subject.timeSpent)}
                </Badge>
                {isTimerRunning ? (
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 animate-pulse dark:bg-red-500/20">
                    {formatTime(timerValue)}
                  </Badge>
                ) : null}
              </div>
            </div>
            <Button
              variant={isTimerRunning ? "destructive" : "outline"}
              size="sm"
              onClick={handleTimerToggle}
              className="w-full"
            >
              <Clock className="h-4 w-4 mr-2" />
              {isTimerRunning ? "Stop Timer" : "Start Study Timer"}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  )
}

