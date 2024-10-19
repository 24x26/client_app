"use client"
import { useState, useEffect } from 'react'
import { Cloud, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { database } from '@/firebase/firebase-config';
import { ref, onValue } from 'firebase/database';
import { useSearchParams } from 'next/navigation'
import { bytesToSpeed, downlaodFile } from '../actions'
import Link from 'next/link'
const page = () => {
const searchParams = useSearchParams()

const username = searchParams.get("username")
const userId=searchParams.get("userId")

  const [progress, setProgress] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState("")
  const [speedData, setSpeedData] = useState<{ timestamp: number, value: number }[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  useEffect(() => {
    if (isDownloading) {
      // Reference to the user's speedLogs in the Realtime Database
      const speedLogsRef = ref(database, `users/${userId}/speedLogs`);

      // Listen for changes in speedLogs in real-time
      const unsubscribe = onValue(speedLogsRef, (snapshot) => {
        const logs = snapshot.val();
        if (logs) {
          logs.map((log:any,index:number) => {
              setCurrentSpeed(bytesToSpeed(log.value))
              if(index == logs.length - 1){
                setProgress(100)
              }
          });
          //setSpeedData(prev => [...prev.slice(-20), ...formattedLogs]) // Keep last 20 data points
        }
      });

      const downloadInterval = setInterval(() => {
        setProgress(prev => {
        if (prev >= 80) {
          return 80; // Cap the progress at 80%
        }
        return prev + 1;
      }
      )
      }, 200)

      return () => {
        unsubscribe()
        setProgress(100)
        clearInterval(downloadInterval)
      }
    }
  }, [isDownloading, userId])

  const startDownload = () => {
    try {
      downlaodFile(userId!)
      setIsDownloading(true)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-xl font-semibold">Bandwidth test connexion</h1>
        <Link href={"/sign-in"} className="text-white flex items-center gap-2">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Link>
      </header>

      <div className="max-w-md mx-auto text-center">
        <h1 className='text-white text-4xl text-center mb-6'>welcome {username}</h1>
        <Cloud className="w-24 h-24 mx-auto mb-4" />
        <Button 
          onClick={startDownload} 
          disabled={isDownloading}
          className="mb-8 bg-blue-600 hover:bg-blue-700"
        >
          Download file
        </Button>

        <Progress value={progress} className="mb-4" variant="blue" />
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-2 text-gray-300">Current Speed</h2>
      <div className="flex items-baseline justify-center">
        <span className="text-6xl font-bold text-blue-500">{currentSpeed.split(" ")[0]}</span>
        <span className="text-3xl ml-2 text-blue-300">{currentSpeed.split(" ")[1]}</span>
      </div>
    </div>
      </div>
    </div>
  )
}


export default page