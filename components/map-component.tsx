"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// We need to dynamically import OpenLayers since it's a client-side library
import dynamic from "next/dynamic"

// This component will be loaded dynamically with no SSR
const MapWithNoSSR = dynamic(() => import("./map-with-no-ssr"), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">Loading Map...</div>,
})

export default function MapComponent() {
  const [mode, setMode] = useState<"draw" | "edit" | "delete" | null>(null)

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select value={mode || ""} onValueChange={(value: any) => setMode(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draw">Draw Polygon</SelectItem>
            <SelectItem value="edit">Edit Polygon</SelectItem>
            <SelectItem value="delete">Delete Polygon</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => setMode(null)} disabled={!mode}>
          Cancel
        </Button>
      </div>

      <div className="h-[500px] border rounded-md overflow-hidden">
        <MapWithNoSSR mode={mode} />
      </div>
    </div>
  )
}

