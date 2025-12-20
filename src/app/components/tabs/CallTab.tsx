import { useState } from "react"

const CallTab = ({ allCalls, incomingCalls, outgoingCalls }: { allCalls: Array<any>, incomingCalls: Array<any>, outgoingCalls: Array<any> }) => {
  const [callType, setCallType] = useState<string>("")
  const [callStatus, setCallStatus] = useState<string>("")

  const [all, setAll] = useState(allCalls)

  const [allIncomingCalls, setAllIncomingCalls] = useState(incomingCalls)
  const [allIncomingConnectedCall, setAllIncomingConnectedCalls] = useState([])
  const [allIncomingMissedCall, setAllIncomingMissedCalls] = useState([])
  const [allIncomingRejectedCall, setAllIncomingRejectedCalls] = useState([])

  const [allOutgoingCalls, setAllOutgoingCalls] = useState(outgoingCalls)
  const [allOutgoingConnectedCalls, setAllOutgoingConnectedCalls] = useState([])
  const [allOutgoingMissedCalls, setAllOutgoingMissedCalls] = useState([])
  const [allOutgoingRejectedCalls, setAllOutgoingRejectedCalls] = useState([])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Call Logs</h2>

      <div className="flex gap-4 mb-6">
        <select className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setCallType(e.target.value)}>
          <option value="all">All Call Types</option>
          <option value="INCOMING">Incoming</option>
          <option value="OUTGOING">Outgoing</option>
        </select>

        <select className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setCallStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="connected">Connected</option>
          <option value="rejected">Rejected</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl p-4 text-sm text-gray-500">
        {
          all.length !== 0 ? <h1>Calls fetched, now it's time to list them</h1> : <h1>No Call logs</h1>
        }
      </div>
    </div>
  )
}

export default CallTab
