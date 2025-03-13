import StudyTracker from "@/components/study-tracker"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Daily Study Tracker</h1>
      <StudyTracker />
    </main>
  )
}

