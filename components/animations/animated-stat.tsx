"use client"

import { motion } from "framer-motion"

interface AnimatedStatProps {
  label: string
  value: string | number
  suffix?: string
  delay?: number
}

export function AnimatedStat({ label, value, suffix = "", delay = 0 }: AnimatedStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-4"
    >
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <motion.p
        className="text-3xl font-bold"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.1 }}
      >
        {value}
        {suffix}
      </motion.p>
    </motion.div>
  )
}
