import { motion } from "motion/react";

export default function StrokeText({
  text = "Draw Attention",
  strokeColor = "#A78BFA",
  fillColor = "#F8FAFC",
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  ease = "easeOut",
  fontSize = "1em",
  fontWeight = 800,
  className = ""
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        className="w-full h-full overflow-visible"
        style={{ fontWeight }}
      >
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: drawDuration, ease }}
          style={{ fontFamily: 'inherit', fontSize, letterSpacing: 'inherit' }}
        >
          {text}
        </motion.text>
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={fillColor}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: drawDuration + fillDelay, duration: 0.5 }}
          style={{ fontFamily: 'inherit', fontSize, letterSpacing: 'inherit' }}
        >
          {text}
        </motion.text>
      </svg>
    </div>
  );
}
