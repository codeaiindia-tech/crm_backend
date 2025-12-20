import React from 'react'

const page = () => {
  return (
    <div className='w-full h-screen bg-white p-5 flex justify-center items-center gap-x-3 '>
      <a href="/admin-registration" className='bg-green-500 rounded px-5 py-2'>Admin Register</a>
      <a href="/admin-login" className='bg-blue-500 px-5 py-2 text-white rounded' >Admin Login</a>
    </div>
  )
}

export default page
