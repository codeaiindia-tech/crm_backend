"use client"

import { useRouter } from "next/navigation"

const ErrorPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl shadow-sm p-6 text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl">⚠️</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          We encountered an unexpected error while processing your request.
          Please try again or return to the dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
