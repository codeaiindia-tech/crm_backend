import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LuLoaderCircle } from 'react-icons/lu'
import { toast } from 'react-toastify'

const Topbar = ({adminName}:{adminName:String}) => {

  const router = useRouter()

  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false)

  const handleLogOut = async ()=>{

    setButtonIsLoading(true)

    try {
      const response = await axios.get("/api/v1/user/log-out")

      console.log(response.data)

      toast.success(response.data.message)

      setButtonIsLoading(false)

      setTimeout(() => {
        router.push("/")
      }, 1000);
      
    } catch (error:any) {
        console.log(error)
        toast.error(error.response.data.message)
    }
  }

  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-gray-800">
          CRM Admin Dashboard
        </h1>

        <div className="text-lg font-medium text-gray-600">
          Welcome, <span className="font-semibold text-gray-800">{adminName}</span>
        </div>

        { buttonIsLoading ? <button className='text-base font-medium bg-black px-9 py-2 text-white rounded flex justify-center items-center'> <LuLoaderCircle size={22} className='animate-spin' /> </button> : <button onClick={handleLogOut} className='text-base font-medium bg-black px-4 py-2 text-white rounded hover:scale-95 transition-all hover:cursor-pointer'> LOG OUT </button> }
      </div>
  )
}

export default Topbar
