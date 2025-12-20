"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"



const COLORS = ["#22c55e", "#f59e0b", "#ef4444"]

const Chart = ({ missed, rejected, connected }: { missed: number, connected: number, rejected: number }) => {

    const data = [

        { name: "CONNECTED", value: connected },
        { name: "MISSED", value: missed },
        { name: "REJECTED", value: rejected }
    ]

    const isData = data.every(item => item.value === 0)

    console.log("isData", isData)

    return (
        <div className="bg-white p-4 rounded-xl border h-80">

            <div className="w-full h-full">
                {isData ? <div className="flex h-full items-center justify-center text-gray-500">
                    No call data available
                </div> :
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={4}
                            >
                                {data.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>}
            </div>
        </div>
    )
}

export default Chart
