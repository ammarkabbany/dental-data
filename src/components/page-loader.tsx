"use client"

import { motion, AnimatePresence } from "framer-motion"

interface SimplePageLoaderProps {
  isLoading: boolean
  fullScreen?: boolean
  text?: string
  showText?: boolean
}

export default function SimplePageLoader({
  isLoading,
  fullScreen = true,
  text = "Loading",
  showText = true,
}: SimplePageLoaderProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className={`${
            fullScreen ? "fixed inset-0" : "relative"
          } z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-16 w-16">
              {/* Outer circle */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* Spinning arc */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
              />
              
              {/* Inner pulsing circle */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="h-4 w-4 rounded-full bg-primary" />
              </motion.div>
            </div>
            
            {showText && (
              <motion.p
                className="text-lg font-medium text-foreground/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {text}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
