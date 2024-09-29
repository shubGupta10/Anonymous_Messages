'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { MessageSquare, Menu, X } from 'lucide-react'
import { Loader2 } from 'lucide-react'; 

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
    };

    useEffect(() => {
        return () => setLoading(false);
    }, []);

    return (
        <nav className="p-4 shadow-md bg-black text-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
                        <MessageSquare size={24} />
                        <span>Anonymous Feedback</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <>
                                <span className="items-center">
                                    Welcome, <span className="font-semibold">{user?.username || user?.email}</span>
                                </span>
                                <Button 
                                    onClick={handleLogout} 
                                    className="bg-white text-black hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center" 
                                    variant='outline'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    ) : (
                                        'Logout'
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button 
                                    className="bg-white text-black hover:bg-gray-200 transition-colors duration-200" 
                                    variant={'outline'}
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                    <button 
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="mt-4 flex flex-col space-y-4 md:hidden">
                        {session ? (
                            <>
                                <span className="items-center">
                                    Welcome, <span className="font-semibold">{user?.username || user?.email}</span>
                                </span>
                                <Button 
                                    onClick={handleLogout} 
                                    className="bg-white text-black hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center" 
                                    variant='outline'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    ) : (
                                        'Logout'
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button 
                                    className="bg-white text-black hover:bg-gray-200 transition-colors duration-200 w-full" 
                                    variant={'outline'}
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
