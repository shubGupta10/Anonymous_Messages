'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { MessageSquare, Menu, X, LogOut } from 'lucide-react'
import { Loader2 } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      setLoading(false)
    }
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0A0F1C]/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-xl font-bold text-white hover:text-blue-400 transition-colors"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="hidden sm:inline">Anonymous Feedback</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                <span className="text-gray-300">
                  Welcome, <span className="text-blue-400 font-medium">{user?.username || user?.email}</span>
                </span>
                <Button 
                  onClick={handleLogout} 
                  variant="ghost"
                  className="text-white hover:text-blue-400 hover:bg-blue-900/20 transition-all duration-200 flex items-center space-x-2" 
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 transition-all duration-200" 
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-[#0A0F1C]/95 backdrop-blur-md shadow-lg border-t border-blue-900/30">
            <div className="px-4 py-6 space-y-4">
              {session ? (
                <>
                  <div className="text-gray-300 pb-2 border-b border-blue-900/30">
                    Welcome, <span className="text-blue-400 font-medium">{user?.username || user?.email}</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost"
                    className="w-full text-white hover:text-blue-400 hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center space-x-2" 
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Link href="/sign-in" className="block">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar