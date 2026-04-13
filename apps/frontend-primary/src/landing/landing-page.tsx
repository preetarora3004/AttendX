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

      <div className="relative z-10">
    
        <nav className="fixed top-0 w-full backdrop-blur-md bg-background/80 border-b border-border z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">AttendX</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            </div>

            <div className="flex items-center gap-4">
              {/* <Link href="/page" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/page" className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                Get Started
              </Link> */}
            </div>
          </div>
        </nav>