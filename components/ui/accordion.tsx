'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="pb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  )
}

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn('space-y-0', className)}>{children}</div>
}


