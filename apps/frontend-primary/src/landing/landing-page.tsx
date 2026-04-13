'use client'

import { useState } from 'react'
import { ChevronRight, BookOpen, Users, Zap, Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

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
              <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/auth" className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        <section className="min-h-screen flex items-center justify-center pt-24 px-6">
          <div className="max-w-6xl mx-auto text-center animate-slide-up">
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">✨ The Future of Education</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up-delay text-balance">
              Smart Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Redefined</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up-delay-2">
              Empower your classroom with seamless attendance tracking, interactive lectures, and real-time student engagement. All in one intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-3">
              <Link to="/auth" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                Start Learning Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-all duration-300">
                Watch Demo
              </button>
            </div>


          </div>
        </section>

        <section id="features" className="py-24 px-6 bg-gradient-to-b from-transparent to-primary/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Powerful Features for Every Role</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Whether you&apos;re a student or teacher, our platform has everything you need</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div 
                className="group bg-card/80 backdrop-blur border border-border rounded-3xl p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 animate-slide-up-delay cursor-pointer"
                onMouseEnter={() => setHoveredCard('student')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">For Students</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Quick attendance with QR code scanning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">View enrolled classes and schedules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Track attendance records</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Access timetable in real-time</span>
                  </li>
                </ul>
                <Link to="/auth" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-semibold">
                  Explore Student Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div 
                className="group bg-card/80 backdrop-blur border border-border rounded-3xl p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 animate-slide-up-delay-2 cursor-pointer"
                onMouseEnter={() => setHoveredCard('teacher')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">For Teachers</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Generate QR codes for lectures instantly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Manage classes and student enrollment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Create events and assignments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Track attendance analytics</span>
                  </li>
                </ul>
                <Link to="/auth" className="inline-flex items-center gap-2 text-secondary hover:gap-3 transition-all duration-300 font-semibold">
                  Explore Teacher Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Simple, intuitive, and designed for everyone</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: 'Sign Up', description: 'Choose your role as a student or teacher and create your account in seconds' },
                { step: 2, title: 'Get Connected', description: 'Join or create classes, connect with peers, and organize your learning' },
                { step: 3, title: 'Start Learning', description: 'Scan QR codes, track attendance, and access all your classes seamlessly' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-card/50 backdrop-blur border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 animate-slide-up`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-border py-12 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">AttendX</span>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 AttendX. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}