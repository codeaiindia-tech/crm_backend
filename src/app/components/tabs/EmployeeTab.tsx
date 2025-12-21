"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import axios from "axios"
import { toast } from "react-toastify"
import { FiRefreshCw } from "react-icons/fi"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import bcrypt from "bcryptjs"

const EmployeeTab = () => {
  const [allEmployees, setAllEmployees] = React.useState<any[]>([])
  const [loadingDelete, setLoadingDelete] = React.useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = React.useState<any | null>(null)
  const [showCallHistory, setShowCallHistory] = React.useState<boolean>(false)

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

  const handleCallHistory = () => {
    setShowCallHistory((prev) => !prev)
  }

  // const password = await bcrypt.verify()

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
              <button className="px-2 py-1 rounded bg-black text-white hover:cursor-pointer" >Reset</button>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={ handleCallHistory } className="bg-black text-white px-4 py-2 rounded">
              { showCallHistory ? "Hide Call History" : "Show Call History" }
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

        {showCallHistory && <div className="rounded-xl bg-white p-6 mt-5 border h-[45vh]" > hello</div>}
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
