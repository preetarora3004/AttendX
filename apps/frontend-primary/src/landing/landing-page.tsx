'use client'

import { useState } from 'react'
import { ChevronRight, BookOpen, Users, Zap, Award, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(91,127,214,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(91,127,214,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-pulse opacity-50" />
      </div>