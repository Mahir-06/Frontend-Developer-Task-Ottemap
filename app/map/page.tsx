"use client"

import { useEffect, useState } from "react"
import MapComponent from "@/components/map-component"

export default function MapPage() {
  const [firstName, setFirstName] = useState("")

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("userData")
    if (userData) {
      const { firstName } = JSON.parse(userData)
      setFirstName(firstName)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 border-b">
        <h1 className="text-2xl font-bold text-center">{firstName}</h1>
      </header>
      <main className="flex-1">
        <MapComponent />
      </main>
    </div>
  )
}

