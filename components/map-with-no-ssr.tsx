"use client"

import { useEffect, useRef, useState } from "react"

// Import OpenLayers components
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import { Draw, Modify, Select, Snap } from "ol/interaction"
import { Fill, Stroke, Style } from "ol/style"
import { defaults as defaultControls } from "ol/control"
import { Type as GeometryType } from "ol/geom/Geometry"

interface MapWithNoSSRProps {
  mode: "draw" | "edit" | "delete" | null
}

export default function MapWithNoSSR({ mode }: MapWithNoSSRProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [vectorSource, setVectorSource] = useState<VectorSource | null>(null)
  const [draw, setDraw] = useState<Draw | null>(null)
  const [modify, setModify] = useState<Modify | null>(null)
  const [select, setSelect] = useState<Select | null>(null)
  const [snap, setSnap] = useState<Snap | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    // Create vector source for features
    const source = new VectorSource()
    setVectorSource(source)

    // Create vector layer
    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 165, 0, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ff5722",
          width: 2,
        }),
      }),
    })

    // Create map
    const mapObject = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vector,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      controls: defaultControls({
        zoom: true,
        rotate: false,
        attribution: true,
      }),
    })

    setMap(mapObject)

    return () => {
      mapObject.setTarget(undefined)
    }
  }, [])

  // Handle mode changes
  useEffect(() => {
    if (!map || !vectorSource) return

    // Remove previous interactions
    if (draw) map.removeInteraction(draw)
    if (modify) map.removeInteraction(modify)
    if (select) map.removeInteraction(select)
    if (snap) map.removeInteraction(snap)

    // Add new interactions based on mode
    if (mode === "draw") {
      const drawInteraction = new Draw({
        source: vectorSource,
        type: 'Polygon',
      })
      map.addInteraction(drawInteraction)
      setDraw(drawInteraction)

      const snapInteraction = new Snap({ source: vectorSource })
      map.addInteraction(snapInteraction)
      setSnap(snapInteraction)
    } else if (mode === "edit") {
      const modifyInteraction = new Modify({ source: vectorSource })
      map.addInteraction(modifyInteraction)
      setModify(modifyInteraction)

      const snapInteraction = new Snap({ source: vectorSource })
      map.addInteraction(snapInteraction)
      setSnap(snapInteraction)
    } else if (mode === "delete") {
      const selectInteraction = new Select()
      map.addInteraction(selectInteraction)
      setSelect(selectInteraction)

      // Add event listener for feature selection
      selectInteraction.on("select", (e) => {
        const selectedFeatures = e.selected
        if (selectedFeatures.length > 0) {
          // Remove selected features from source
          selectedFeatures.forEach((feature) => {
            vectorSource.removeFeature(feature)
          })
          // Clear selection
          selectInteraction.getFeatures().clear()
        }
      })
    }

    return () => {
      if (draw) map.removeInteraction(draw)
      if (modify) map.removeInteraction(modify)
      if (select) map.removeInteraction(select)
      if (snap) map.removeInteraction(snap)
    }
  }, [map, vectorSource, mode])

  return <div ref={mapRef} className="w-full h-full" />
}

