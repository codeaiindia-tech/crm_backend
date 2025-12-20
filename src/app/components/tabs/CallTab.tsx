import { useEffect, useState } from "react"

const CallTab = ({ allCalls, incomingCalls, outgoingCalls }: { allCalls: Array<any>, incomingCalls: Array<any>, outgoingCalls: Array<any> }) => {


  const [callType, setCallType] = useState<string>("all")
  const [callStatus, setCallStatus] = useState<string>("all")

  const [all, setAll] = useState(allCalls)
  const [interested, setInterested] = useState("all")

  useEffect(()=>{

    let filtered = allCalls

    //filter based on CallType
    if( callType !== "all" ){
        filtered = filtered.filter((call) => call.callType === callType )
    }

    //filter based on callStatus
    if( callStatus !== "all" ){
      filtered = filtered.filter((call) => call.callStatus === callStatus )
    }

    if( interested !== "all" ){
      filtered = filtered.filter((call) => call.interested === (interested === "true") )
    }

    setAll(filtered)

  },[ callStatus, callType, interested])

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
          <option value="CONNECTED">Connected</option>
          <option value="REJECTED">Rejected</option>
          <option value="MISSED">Missed</option>
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm" onChange={(e) => setInterested(e.target.value)}>
          <option value="all">Interested</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl p-4 text-sm">
        {all.length > 0 ? (
          <>
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 border-b pb-2 mb-3 text-gray-600 font-semibold">
              <span>Lead Name</span>
              <span>Lead Phone Number</span>
              <span>Call Type</span>
              <span>Call Status</span>
              <span>Interested</span>
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {all.map((call) => (
                <div
                  key={call._id}
                  className="grid grid-cols-5 gap-4 items-center border-b last:border-b-0 py-2"
                >
                  {/* Lead Name */}
                  <span className="text-gray-800 font-medium">
                    {call.leadName}
                  </span>

                  {/* Phone */}
                  <a
                    href={`tel:${call.leadPhoneNumber}`}
                    className="text-blue-600 hover:underline"
                  >
                    {call.leadPhoneNumber}
                  </a>

                  {/* Call Type */}
                  <span
                    className={`w-fit px-2 py-1 rounded text-xs font-medium ${call.callType === "INCOMING"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {call.callType}
                  </span>

                  {/* Call Status */}
                  <span
                    className={`w-fit px-2 py-1 rounded text-xs font-medium ${call.callStatus === "connected"
                      ? "bg-emerald-100 text-emerald-700"
                      : call.callStatus === "missed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {call.callStatus || "N/A"}
                  </span>

                  {/* Interested */}
                  <span
                    className={`font-medium ${call.interested ? "text-green-600" : "text-gray-400"
                      }`}
                  >
                    {call.interested ? "Yes" : "No"}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h1 className="text-center text-gray-400 py-6">No Call logs</h1>
        )}
      </div>
    </div>
  )
}

export default CallTab
