"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import axios from "axios"
import { toast } from "react-toastify"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FiRefreshCw } from "react-icons/fi"

const EmployeeTab = () => {

  const [allEmployees, setAllEmployees] = React.useState([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [employeeData, setEmployeeData] = React.useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  })

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/v1/user/get-all-employees", { withCredentials: true })

      console.log("Response employee fetch: ", response.data)

      setAllEmployees(response.data.data)

      toast.success(response.data.message)

    } catch (error: any) {
      console.log("Error while fetching Employees")
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmployeeData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Form to be submitted: ", employeeData)

    try {

      const response = await axios.post("/api/v1/user/register-employee", employeeData)

      console.log("Response from registering the user", response.data)

      toast.success(response.data.message)

      setEmployeeData({
        name: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
      })

    } catch (error: any) {
      console.log("Error while registering the employee")
      console.error(error)
    }

  }

  const refresh = () => {
    fetchEmployees()
  }

  React.useEffect(() => {
    fetchEmployees()
  }, [])

  const deleteEmployee = async ({ empId }: { empId: any }) => {
    try {
      const response = await axios.get(`/api/v1/user/delete-employee?uId=${empId}`)

      console.log("Delete Employee: ", response.data)

      toast.success(response.data.message)

    } catch (error: any) {
      console.log("Error while deleting the employee")
      console.error(error)
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex justify-center items-center gap-5">
          <h2 className="text-lg font-semibold">Employees</h2>
          <span onClick={refresh} className="p-2 rounded bg-gray-300 hover:cursor-pointer hover:bg-gray-400 transition-all ">
            <FiRefreshCw />
          </span>
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="rounded bg-black px-4 py-2 text-sm text-white">
              + Create Employee
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />

            <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow focus:outline-none">
              <Dialog.Title className="mb-4 text-lg font-semibold">
                Add New Employee
              </Dialog.Title>

              {/* NAME */}
              <div className="mb-4 flex items-center gap-4">
                <label className="w-[130px] text-sm">Name</label>
                <input
                  name="name"
                  type="text"
                  value={employeeData.name}
                  onChange={handleChange}
                  className="h-9 w-full rounded border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-4 flex items-center gap-4">
                <label className="w-[130px] text-sm">Email</label>
                <input
                  name="email"
                  type="email"
                  value={employeeData.email}
                  onChange={handleChange}
                  className="h-9 w-full rounded border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* PHONE */}
              <div className="mb-4 flex items-center gap-4">
                <label className="w-[130px] text-sm">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  value={employeeData.phoneNumber}
                  onChange={handleChange}
                  className="h-9 w-full rounded border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* DOB */}
              <div className="mb-4 flex items-center gap-4">
                <label className="w-[130px] text-sm">Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={employeeData.dateOfBirth}
                  onChange={handleChange}
                  className="h-9 w-full rounded border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-4 flex items-center gap-4">
                <label className="w-[130px] text-sm">Password</label>
                <input
                  name="password"
                  type="password"
                  value={employeeData.password}
                  onChange={handleChange}
                  className="h-9 w-full rounded border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-6 flex items-center gap-4">
                <label className="w-[130px] text-sm">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={employeeData.confirmPassword}
                  onChange={handleChange}
                  className="h-9 w-full rounded border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="rounded border px-4 py-2 text-sm">
                    Cancel
                  </button>
                </Dialog.Close>

                <Dialog.Close asChild>
                  <button onClick={handleSubmit} className="rounded bg-black px-4 py-2 text-sm text-white">
                    Save
                  </button>
                </Dialog.Close>
              </div>

              {/* CLOSE ICON */}
              <Dialog.Close asChild>
                <button className="absolute right-3 top-3 text-gray-500 hover:text-black">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* TABLE PLACEHOLDER */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {allEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-lg">👤</span>
            </div>
            <p className="text-sm font-medium text-gray-700">
              No employees found
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Click “Create Employee” to add your first employee.
            </p>
          </div>
        ) : (
          <div className="rounded overflow-hidden">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-5 border-b bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 text-center rounded">
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Total Calls</div>
              <div className="text-right">Actions</div>
            </div>

            {/* TABLE ROWS */}
            {allEmployees.map((emp: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-5 items-center text-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                {/* NAME */}
                <div className="font-medium text-gray-900 uppercase">
                  {emp.name}
                </div>

                {/* EMAIL */}
                <div className="truncate">{emp.email}</div>

                {/* PHONE */}
                <div>{emp.phoneNumber}</div>

                {/* DOB */}
                {/* <div className="text-gray-500">
                  {emp.dateOfBirth
                    ? new Date(emp.dateOfBirth).toLocaleDateString()
                    : "—"}
                </div> */}

                <div className="text-gray-500 text-center" >
                  {emp.totalCalls.length}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3">
                  <button className="bg-blue-600 px-3 py-1 rounded font-medium text-white hover:cursor-pointer">
                    View
                  </button>
                  {isLoading ?
                    <button className="bg-red-600 text-white w-[3vw] rounded font-medium hover:cursor-pointer flex justify-center items-center">
                      <AiOutlineLoading3Quarters size={18} className="animate-spin" />
                    </button> :
                    <button onClick={() => deleteEmployee({ empId: emp._id })} className="bg-red-600 text-white px-3 py-1 rounded font-medium hover:cursor-pointer">
                      Delete
                    </button>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default EmployeeTab
