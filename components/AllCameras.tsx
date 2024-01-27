"use client"

import React, { useCallback, useEffect, useState } from "react"
import Webcam from "react-webcam"

// Show all the cameras are there in my pc
export default function AllCameras() {
  // Delete any
  const [devices, setDevices] = useState<any[]>([])
  const handleDevices = useCallback(
    // Delete any
    (mediaDevices: any) => {
      setDevices(
        mediaDevices.filter(
          // Delete any
          ({ kind }: { kind: string }) => kind === "videoinput"
        )
      )
    },
    [setDevices]
  )

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  }, [handleDevices])

  return (
    <>
      {devices.map((device, key) => (
        <div key={key}>
          <Webcam
            audio={false}
            videoConstraints={{ deviceId: device.deviceId }}
          />
          {device.label || `Device ${key + 1}`}
        </div>
      ))}
    </>
  )
}
