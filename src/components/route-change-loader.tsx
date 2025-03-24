"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export default function RouteChangeLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => {
      setTimeout(() => setIsLoading(false), 2000)
    }

    // This effect runs on route changes
    handleStart()

    // Simulate a delay for demo purposes
    const timer = setTimeout(handleComplete, 3000)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary"
          initial={{ width: "0%", opacity: 1 }}
          animate={{
            width: ["0%", "30%", "70%", "100%"],
            opacity: [1, 1, 1, 0],
          }}
          transition={{
            times: [0, 0.3, 0.8, 1],
            duration: 5,
            ease: "easeInOut",
          }}
        />
      )}
    </>
  )
}

