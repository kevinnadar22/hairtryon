import { motion } from "motion/react"
import type { ReactNode } from "react"

interface FadeInTransitionProps {
  children: ReactNode
}

export function FadeInTransition({ children }: FadeInTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}
