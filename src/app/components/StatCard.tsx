import React, { ReactElement } from "react"
import { VscCallIncoming } from "react-icons/vsc";

const StatCard = ({
  title,
  value,
  color,
  symbol
}: {
  title: string
  value: number
  color: string
  symbol: ReactElement
}) => {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className={`text-base text-${color} flex justify-end items-center gap-x-2 flex-row-reverse`}> <h1>{title}</h1>
        {symbol}
      </div>

      <h3 className="mt-2 text-2xl font-semibold text-gray-900">
        {value}
      </h3>
    </div>
  )
}

export default StatCard
