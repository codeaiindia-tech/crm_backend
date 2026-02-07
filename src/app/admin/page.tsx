"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

import Topbar from "../components/Topbar"
import Sidebar from "../components/Sidebar"
import OverallTab from "../components/tabs/OverallTab"
import EmployeeTab from "../components/tabs/EmployeeTab"
import CallTab from "../components/tabs/CallTab"
import SettingsTab from "../components/tabs/SettingTab"
import ErrorPage from "../components/Error"
import Profile from "../components/tabs/Profile"

export type TabType = "overall" | "call" | "employee" | "settings" | "profile"

type CallStatus = {
  missed: number
  rejected: number
  connected: number
}

type CallType = {
  incoming: number,
  outgoing: number
}

const AdminDashboardPage = () => {
  const [access, setAccess] = useState<boolean | null>(true)
  const [isLoading, setIsLoading] = useState<boolean | null>(true)

  const [activeTab, setActiveTab] = useState<TabType>("overall")

  const [adminData, setAdminData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    employeesCreated: [],
    employeesCount: 0,
    callCount: 0,
  })

  const [allCalls, setAllCalls] = useState([])
  const [allIncomingCalls, setAllIncomingCalls] = useState([])
  const [allOutgoingCalls, setAllOutgoingCalls] = useState([])

  const [callStatus, setCallStatus] = useState<CallStatus>(
    {
      missed: 0,
      connected: 0,
      rejected: 0
    }
  )

  const [callType, setCallType] = useState<CallType>({
    incoming: 0,
    outgoing: 0
  })

  // function to get profile data of admin, fetch call count and fetch all incoming/outgoing calls

  const profileFetch = async () => {
    try {

      const response = await axios.get("/api/v1/user/profile-admin", { withCredentials: true })
      const admin = response.data.data

      setAdminData((prev) => ({
        ...prev,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        employeesCreated: admin.employeesCreated,
        employeesCount: admin.employeesCreated.length,
      }))

    } catch (error: any) {
      setAccess(false)
      console.log("Error in fetching admin profile")
      console.log(error)
    }
  }

  // const fetchCallCount = async () => {
  //   try {

  //     const response = await axios.get("/api/v1/call/get-call-count")

  //     console.log(response.data)

  //     const count = response.data.totalCalls

  //     setAdminData((prev) => ({ ...prev, callCount: count }))

  //   } catch (error: any) {
  //     console.log("Error while fetching call count")
  //     console.log(error)
  //   }
  // }


  // fetching INCOMING/OUTGOING CALLS INDIVIDUALLY

  // const fetchCallTypeIncoming = async () => {
  //   console.log("fetchingCallIncome")
  //   try {
  //     const response = await axios.get("/api/v1/call/get-incoming-calls", { withCredentials:true })

  //     console.log("Response for incoming call api: ",response.data)

  //     setCallType((prev)=>({...prev, incoming: response.data.totalIncomingCalls }))

  //   } catch (error:any) {
  //     console.log("Error while fetching call type")
  //     console.log(error.response.data.totalIncomingCalls)
  //     setCallStatus((prev)=>({ ...prev, incoming: error.reponse.data.totalIncomingCalls }))
  //   }
  // }

  // const fetchCallTypeOutgoing = async () => {
  //   try {
  //     const response = await axios.get("/api/v1/call/get-outgoing-calls", { withCredentials:true })

  //     console.log(response.data)

  //     setCallType((prev)=>({...prev, outgoing: response.data.totalOutgoingCall }))

  //   } catch (error:any) {
  //     console.log("Error while fetching the outgoing calls")
  //   }
  // }





  // fetching INCOIMING/OUTGOING CALL at once and total callCount

  const fetchAllCallTypes = async () => {
    try {

      const response = await Promise.allSettled(
        [
          axios.get("/api/v1/call/get-incoming-calls", { withCredentials: true }),
          axios.get("/api/v1/call/get-outgoing-calls", { withCredentials: true }),
          axios.get("/api/v1/call/get-call-count", { withCredentials: true })
        ]
      )

      console.log("RESPONSE FOR CALL LIST: ")
      console.log(response[2])


      const incomingCalls = response[0].status === "fulfilled" ? response[0].value.data.data : []

      const totalIncomingCalls = response[0].status === "fulfilled" ? response[0]?.value.data.totalIncomingCalls : 404

      const outgoingCalls = response[1].status === "fulfilled" ? response[1]?.value.data.data : []

      const totalOutgoingCalls = response[1].status === "fulfilled" ? response[1]?.value.data.totalOutgoingCall : 404

      const allCalls = response[2].status === "fulfilled" ? response[2].value.data.data : []

      const count = response[2].status === "fulfilled" ? response[2].value.data.totalCalls : 0

      setAdminData((prev) => ({ ...prev, callCount: count }))

      setCallType(
        {
          incoming: totalIncomingCalls,
          outgoing: totalOutgoingCalls
        }
      )

      setAllIncomingCalls(incomingCalls)
      setAllOutgoingCalls(outgoingCalls)
      setAllCalls(allCalls)

    } catch (error: any) {
      setAccess(false)
      console.log("Error while fetching INCOMING/OUTGOING Calls")
      console.error(error)
    }
  }

  // fetching all the callStatus at once

  const fetchCallStatus = async () => {
    try {
      const response = await Promise.allSettled(
        [
          axios.get("/api/v1/call/get-connected-calls", { withCredentials: true }),
          axios.get("/api/v1/call/get-missed-calls", { withCredentials: true }),
          axios.get("/api/v1/call/get-rejected-calls", { withCredentials: true })
        ]
      )

      const connectedCalls = response[0].status === "fulfilled" ? response[0].value.data.totalConnectedCalls : 404

      const missedCalls = response[1].status === "fulfilled" ? response[1].value.data.totalMissedCalls : 404

      const rejectedCalls = response[2].status === "fulfilled" ? response[2].value.data.totalRejectedCalls : 404

      setCallStatus(
        {
          connected: connectedCalls,
          missed: missedCalls,
          rejected: rejectedCalls
        }
      )

    } catch (error: any) {
      setAccess(false)
      console.log("Error while fetching CONNECTED/MISSED/REJECTED calls")
      console.error(error)
    }
  }

  useEffect(() => {
    profileFetch()
    fetchAllCallTypes()
    fetchCallStatus()
  }, [])

  setTimeout(() => {
    setIsLoading(false)
  }, 3000);

  const refresh = ()=>{
    setIsLoading(true)
    profileFetch()
    fetchAllCallTypes()
    fetchCallStatus()

    setTimeout(() => {
      setIsLoading(false)
    }, 2000);
    
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar adminName={adminData.name} />

      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="w-full h-[70vh] flex justify-center items-center">
              <AiOutlineLoading3Quarters className="animate-spin" size={28} />
            </div>
          ) : access ? (
            <>
              {activeTab === "overall" && (
                <OverallTab
                  missed={callStatus.missed}
                  rejected={callStatus.rejected}
                  connected={callStatus.connected}
                  incoming={callType.incoming}
                  outgoing={callType.outgoing}
                  callCount={adminData.callCount}
                  employeesCount={adminData.employeesCount}
                  refresh = { refresh } 
                />
              )}
              {activeTab === "call" && <CallTab allCalls={allCalls} incomingCalls={allIncomingCalls} outgoingCalls={allOutgoingCalls} />}
              {activeTab === "employee" && (
                <EmployeeTab />
              )}
              {activeTab === "settings" && <SettingsTab />}
              { activeTab === "profile" && <Profile/> }
            </>
          ) : (
            <ErrorPage />
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardPage
