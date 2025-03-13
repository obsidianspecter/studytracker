"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ThemeToggleProps {
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
}

export default function ThemeToggle({ isDarkMode, setIsDarkMode }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const [themePreference, setThemePreference] = useState<"system" | "light" | "dark">("system")

  // Update theme preference based on localStorage or system preference
  useEffect(() => {
    setMounted(true)

    const savedMode = localStorage.getItem("themePreference")
    if (savedMode === "light" || savedMode === "dark" || savedMode === "system") {
      setThemePreference(savedMode)
    }
  }, [])

  // Apply theme based on preference
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem("themePreference", themePreference)

    if (themePreference === "system") {
      const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(systemPrefersDark)
    } else {
      setIsDarkMode(themePreference === "dark")
    }
  }, [themePreference, setIsDarkMode, mounted])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setThemePreference("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {themePreference === "light" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemePreference("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {themePreference === "dark" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemePreference("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {themePreference === "system" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

