import { VscCallIncoming } from "react-icons/vsc"
import Chart from "../Chart"
import StatCard from "../StatCard"
import { FiPhoneOutgoing } from "react-icons/fi"
import { MdPerson } from "react-icons/md"
import { IoCallSharp } from "react-icons/io5"


const OverallTab = ({ employeesCount, callCount, missed, connected, rejected, incoming, outgoing }: { employeesCount: number, callCount: number, missed: number, connected: number, rejected: number, incoming: number, outgoing: number }) => {
  return (
    <div>

      <h2 className="text-lg font-semibold mb-2" >Charts View</h2>
      <div className="py-4">
        <Chart missed={missed} connected={connected} rejected={rejected} />
      </div>

      <h2 className="text-lg font-semibold mb-4">Overall Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Calls" value={callCount} color="black" symbol={<IoCallSharp color="black" size={18} />} />
        <StatCard title="Total Incoming Calls" value={incoming} color={"green-400"} symbol={<VscCallIncoming color="green" size={18} />} />
        <StatCard title="Total Outgoing Calls" value={outgoing} color="red" symbol={<FiPhoneOutgoing color="gray" size={18} />} />
        <StatCard title="Total Employees" value={employeesCount} color="red" symbol={<MdPerson size={18} />} />
      </div>
    </div>
  )
}

export default OverallTab
