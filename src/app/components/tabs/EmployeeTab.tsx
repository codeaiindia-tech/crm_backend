"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import axios from "axios"
import { toast } from "react-toastify"
import { FiRefreshCw } from "react-icons/fi"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const EmployeeTab = () => {
  const [allEmployees, setAllEmployees] = React.useState<any[]>([])
  const [loadingDelete, setLoadingDelete] = React.useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = React.useState<any | null>(null)
  const [showCallHistory, setShowCallHistory] = React.useState<boolean>(false)
  const [callHistory, setCallHistory] = React.useState([])
  const [dataForChangePassword, setDataForChangePassword] = React.useState(
    {
      phoneNumber: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  )


  const [employeeData, setEmployeeData] = React.useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  })

  /* ================= FETCH EMPLOYEES ================= */

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/v1/user/get-all-employees", {
        withCredentials: true,
      })
      setAllEmployees(res.data.data)
    } catch (err: any) {
      toast.error("Failed to fetch employees")
    }
  }

  React.useEffect(() => {
    fetchEmployees()
  }, [])

  /* ================= CREATE EMPLOYEE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmployeeData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/register-employee",
        employeeData
      )
      toast.success(res.data.message)
      fetchEmployees()
      setEmployeeData({
        name: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
      })
    } catch (err: any) {
      toast.error("Failed to create employee")
    }
  }



  const fetchCallLog = async () => {
    if (selectedEmployee) {
      try {
        const response = await axios.get(`/api/v1/user/get-all-calls-from-employee?uId=${selectedEmployee._id}`)

        console.log("Response for call log from employee", response.data)

        setCallHistory(response.data.data)

      } catch (error: any) {
        console.log("Error while fetching the call log from the employee", error)
        console.log(error.response.data.message)
      }
    }
  }

  /* ================= DELETE EMPLOYEE ================= */

  const deleteEmployee = async (empId: string) => {
    try {
      setLoadingDelete(empId)
      const res = await axios.get(
        `/api/v1/user/delete-employee?uId=${empId}`
      )
      toast.success(res.data.message)
      fetchEmployees()
      setSelectedEmployee(null)
    } catch {
      toast.error("Delete failed")
    } finally {
      setLoadingDelete(null)
    }
  }


  // change password api

  const handleChangePassword = async () => {
    console.log(dataForChangePassword)
    try {
      const response = await axios.post("/api/v1/user/change-password", dataForChangePassword)

      console.log("RESPONSE DATA: ", response.data)

      toast.success(response.data.message || "Process Completed" )

    } catch (error: any) {
      console.log("Error while API request", error)
      toast.error(error.response.data.message)
    }
  }




  const handleCallHistory = () => {
    setShowCallHistory((prev) => !prev)
  }

  React.useEffect(() => {
    if (showCallHistory && selectedEmployee?._id) {
      fetchCallLog()
    }
  }, [showCallHistory, selectedEmployee])



  if (selectedEmployee) {
    return (
      <>
        <div className="rounded-xl bg-white border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Employee Detail</h2>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="border px-4 py-2 rounded"
            >
              Back
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <Detail label="Name" value={selectedEmployee.name} />
            <Detail label="Email" value={selectedEmployee.email} />
            <Detail label="Phone" value={selectedEmployee.phoneNumber} />
            <Detail
              label="Date of Birth"
              value={
                selectedEmployee.dateOfBirth
                  ? new Date(
                    selectedEmployee.dateOfBirth
                  ).toLocaleDateString()
                  : "—"
              }
            />
            <Detail
              label="Total Calls"
              value={selectedEmployee.totalCalls?.length || 0}
            />
            {/* <Detail label="Password" value={selectedEmployee.password} /> */}
            <div>
              <p className="text-sm text-gray-500">Password</p>

              {/* introduce shadcn pop-up */}
              <Dialog.Root>
                <DialogTrigger className="px-2 py-1 border bg-gray-100 mt-1 rounded hover:cursor-pointer " >Reset</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently change your password from our servers.
                    </DialogDescription>
                    <div className=" p-3" >
                      <div className="w-full flex flex-col justify-center items-center gap-y-5">
                        <div className="w-full flex justify-between px-5 items-center ">
                          <label htmlFor="phoneNumber">Phone Number</label>
                          <input
                            type="text"
                            className="px-4 py-2 border border-gray-300 outline-none rounded w-1/2"
                            value={dataForChangePassword.phoneNumber}
                            onChange={(e) => setDataForChangePassword({ ...dataForChangePassword, phoneNumber: e.target.value })}
                          />
                        </div>
                        <div className="w-full flex justify-between px-5 items-center">
                          <label htmlFor="newPassword">New Password</label>
                          <input
                            type="password"
                            className="px-4 py-2 border border-gray-300 outline-none rounded w-1/2"
                            value={dataForChangePassword.newPassword}
                            onChange={(e) => setDataForChangePassword({ ...dataForChangePassword, newPassword: e.target.value })}
                          />
                        </div>
                        <div className="w-full flex justify-between px-5 items-center">
                          <label htmlFor="confirmPassword">Confirm Password</label>
                          <input type="text" className="px-4 py-2 border border-gray-300 outline-none rounded w-1/2"
                            value={dataForChangePassword.confirmNewPassword}
                            onChange={(e) => setDataForChangePassword({ ...dataForChangePassword, confirmNewPassword: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-x-5 justify-end ">
                      <button onClick={handleChangePassword} className="px-4 py-2 bg-black text-white rounded hover:cursor-pointer" >Save</button>
                      <Dialog.Close className="px-4 py-2 border-gray-500 border rounded" >Cancel</Dialog.Close>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog.Root>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={handleCallHistory} className="bg-black text-white px-4 py-2 rounded">
              {showCallHistory ? "Hide Call History" : "Show Call History"}
            </button>
            <button
              onClick={() => deleteEmployee(selectedEmployee._id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              {loadingDelete === selectedEmployee._id ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Delete Employee"
              )}
            </button>
          </div>
        </div>

        {showCallHistory && (
          <div className="rounded-xl bg-white border mt-5 overflow-hidden">

            {/* Header */}
            <div className="grid grid-cols-4 border-b px-5 py-3 text-sm font-semibold">
              <div>Name</div>
              <div>Phone</div>
              <div>Created At</div>
              <div>Interested</div>
            </div>

            {/* Rows */}
            <div className="max-h-[50vh] overflow-y-auto">
              {callHistory.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-gray-500">
                  No call history found
                </div>
              ) : (
                callHistory.map((call: any) => (
                  <div
                    key={call._id}
                    className="grid grid-cols-4 border-b px-5 py-3 text-sm"
                  >
                    <div className="truncate">{call.leadName}</div>
                    <div>{call.leadPhoneNumber}</div>
                    <div>
                      {new Date(call.createdAt).toLocaleString()}
                    </div>
                    <div className="ml-8">{call.interested ? "Yes" : "No"}</div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}


      </>
    )
  }

  /* ================= EMPLOYEE LIST VIEW ================= */

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Employees</h2>
          <span
            onClick={fetchEmployees}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            <FiRefreshCw />
          </span>
        </div>

        {/* CREATE EMPLOYEE */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-black text-white px-4 py-2 rounded">
              + Create Employee
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Add Employee
              </Dialog.Title>

              {Object.keys(employeeData).map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  value={(employeeData as any)[field]}
                  onChange={handleChange}
                  type={
                    field.includes("password")
                      ? "password"
                      : field === "dateOfBirth"
                        ? "date"
                        : "text"
                  }
                  className="w-full border rounded px-3 py-2 mb-3 text-sm"
                />
              ))}

              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="border px-4 py-2 rounded">Cancel</button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    onClick={handleSubmit}
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </Dialog.Close>
              </div>

              <Dialog.Close asChild>
                <button className="absolute top-3 right-3">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-white">
        <div className="grid grid-cols-5 bg-gray-50 px-4 py-3 text-sm font-semibold">
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Total Calls</div>
          <div className="text-right">Actions</div>
        </div>

        {allEmployees.map((emp) => (
          <div
            key={emp._id}
            className="grid grid-cols-5 px-4 py-3 text-sm items-center hover:bg-gray-50"
          >
            <div className="font-medium">{emp.name}</div>
            <div>{emp.email}</div>
            <div>{emp.phoneNumber}</div>
            <div>{emp.totalCalls?.length || 0}</div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedEmployee(emp)}
                className="bg-black text-white px-3 py-1 rounded"
              >
                View
              </button>
              <button
                onClick={() => deleteEmployee(emp._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                {loadingDelete === emp._id ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmployeeTab

const Detail = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-base">{value}</p>
  </div>
)
