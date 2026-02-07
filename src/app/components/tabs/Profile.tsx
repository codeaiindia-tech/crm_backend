"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import axios from 'axios'

const Profile = () => {

  const [admin, setAdmin] = useState({
    name: "",
    phone: "",
    email: "",
    totalEmployees: 0,
    createdAt: ""
  })

  const [nameInitials, setNameInitials] = useState("")


  useEffect(() => {
    const profileFetch = async () => {
      try {
        const response = await axios.get("/api/v1/user/profile-admin")

        const data = response.data.data

        console.log("Profile fetched successfully", response)

        setAdmin({
          name: data.name,
          phone: data.phoneNumber,
          email: data.email,
          totalEmployees: data.employeesCreated.length,
          createdAt: data.createdAt.split("T")[0]
        })

        setNameInitials(data.name.charAt(0) + data.name.split(" ")[1].charAt(0))

      } catch (error: any) {
        console.log("Error while profile fetch API")
        console.log(error.message)
      }

    }

    profileFetch()

  }, [])






  return (
    <div className="px-24 h-full flex justify-center items-start pt-5 w-full">
      <Card className="w-full shadow-md rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-black text-white text-lg">
                <h1 className='text-2xl'>
                  {nameInitials}
                </h1>
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Admin Profile</h2>
              <p className="text-sm text-gray-500">Personal & account details</p>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Name" value={admin.name} />
            <ProfileField label="Phone Number" value={admin.phone} />
            <ProfileField label="Email" value={admin.email} />
            <ProfileField
              label="Total Employees Under Admin"
              value={admin.totalEmployees}
            />
            <ProfileField label="Account Created On" value={admin.createdAt} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


function ProfileField({ label, value }: { label: String, value: any }) {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

export default Profile
