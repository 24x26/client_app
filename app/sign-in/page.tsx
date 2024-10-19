"use client"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wifi } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { loginClient } from '../actions'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
export default function SignUp() {
  const [username, setUsername] = useState('')
    const router = useRouter()
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const res = await loginClient(username)
    if(typeof res === 'object'){
        router.push(`/home?username=${username}&userId=${res.userId}`)
        toast.success("Successfully logged in")
    }

  }
  return (
    <div className="flex h-screen max-w-6xl w-full mx-auto py-16">
      <div className="w-full md:w-2/3 mx-auto lg:w-1/2 bg-white p-12 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">Sign In</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">USERNAME:</label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Roza"
              />
            </div>
            <div className="flex space-x-4 items-center">
              <Button variant={"ghost"} className="w-1/2 bg-black rounded-md text-white">
                Sign in
              </Button>
              <span>
                Dont have an account ?
              <Link href={"/sign-up"} className='underline'>sign up</Link>
              </span>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Wifi className="w-4 h-4 mr-2" />
          <span>Bandwidth test connexion</span>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative">
       <Image src={"/background.jpg"} fill objectFit='cover'  alt='background-network' className='h-full w-full rounded-2xl' />
      </div>
    </div>
  )
}