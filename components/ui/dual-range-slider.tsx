"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface DualRangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  className?: string
  formatValue?: (value: number) => string
}

export function DualRangeSlider({
  min,
  max,
  step = 50,
  value,
  onChange,
  className,
  formatValue = (v) => v.toLocaleString()
}: DualRangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0])
  const [maxVal, setMaxVal] = useState(value[1])
  const minValRef = useRef<HTMLInputElement>(null)
  const maxValRef = useRef<HTMLInputElement>(null)
  const range = useRef<HTMLDivElement>(null)

  // Convert to percentage
  const getPercent = (val: number) => Math.round(((val - min) / (max - min)) * 100)

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal)
      const maxPercent = getPercent(+maxValRef.current.value)

      if (range.current) {
        range.current.style.left = `${minPercent}%`
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value)
      const maxPercent = getPercent(maxVal)

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [maxVal, getPercent])

  // Sync with external value changes
  useEffect(() => {
    setMinVal(value[0])
    setMaxVal(value[1])
  }, [value])

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative h-12 flex items-center py-2">
        {/* Track Background */}
        <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full pointer-events-none"></div>
        
        {/* Active Range */}
        <div
          ref={range}
          className="absolute h-2 rounded-full pointer-events-none"
          style={{ backgroundColor: '#139ED4' }}
        ></div>
        
        {/* Visual Handles - Below inputs, only for display */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `calc(${getPercent(minVal)}% - 10px)`
          }}
        >
          <div className="relative group">
            <div 
              className="w-5 h-5 bg-white rounded-full shadow-md transition-transform"
              style={{ border: '2px solid #139ED4' }}
            ></div>
            <div 
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ backgroundColor: '#171D4C' }}
            >
              S/ {formatValue(minVal)}
            </div>
          </div>
        </div>
        
        {/* Max Handle */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `calc(${getPercent(maxVal)}% - 10px)`
          }}
        >
          <div className="relative group">
            <div 
              className="w-5 h-5 bg-white rounded-full shadow-md transition-transform"
              style={{ border: '2px solid #139ED4' }}
            ></div>
            <div 
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ backgroundColor: '#171D4C' }}
            >
              S/ {formatValue(maxVal)}
            </div>
          </div>
        </div>
        
        {/* Invisible Range Inputs - Must be on top for interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          ref={minValRef}
          onChange={(e) => {
            const value = Math.min(+e.target.value, maxVal - step)
            setMinVal(value)
            onChange([value, maxVal])
          }}
          className="absolute w-full h-12 bg-transparent appearance-none cursor-pointer z-30 slider-thumb slider-min"
          style={{ 
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
        />
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          ref={maxValRef}
          onChange={(e) => {
            const value = Math.max(+e.target.value, minVal + step)
            setMaxVal(value)
            onChange([minVal, value])
          }}
          className="absolute w-full h-12 bg-transparent appearance-none cursor-pointer z-30 slider-thumb slider-max"
          style={{ 
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
        />
      </div>
      
      {/* Value Labels */}
      <div className="flex justify-between mt-6">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mín</span>
          <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
            <span className="text-sm font-medium dark:text-white" style={{ color: '#171D4C' }}>
              S/ {formatValue(minVal)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Máx</span>
          <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
            <span className="text-sm font-medium dark:text-white" style={{ color: '#171D4C' }}>
              S/ {formatValue(maxVal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

