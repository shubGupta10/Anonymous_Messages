'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { Loader2, RefreshCcw, LinkIcon, Clipboard, MessageSquare, Settings, ChevronRight, Bell, Users, BarChart3, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import MessageCards from '@/components/MessageCards'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isAnonShieldLoading, setIsAnonShieldLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState<string>('')
  const [stats, setStats] = useState({
    totalMessages: 0,
    newMessages: 0,
    activeUsers: 0
  })

  const { toast } = useToast()
  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')
  const [anonShield, setAnonShield] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
    setStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages - 1
    }))
  }

  const fetchAcceptMessage = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await fetch('/api/accept-message')
      const data = await response.json()
      setValue('acceptMessages', data.isAcceptingMessages)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch message settings',
        variant: 'destructive',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const fetchAnonShield = async () => {
    setIsAnonShieldLoading(true)
    try {
      const response = await fetch('/api/anon-shield')
      const data = await response.json()
      setAnonShield(data.anonShield)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch Anon Shield settings',
        variant: 'destructive',
      })
    } finally {
      setIsAnonShieldLoading(false)
    }
  }

  const fetchMessages = async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/get-messages')
      const data = await response.json()
      setMessages(data.messages || [])
      setStats({
        totalMessages: data.messages?.length || 0,
        newMessages: data.messages?.length || 0,
        activeUsers: 50 
      })
      if (refresh) {
        toast({
          title: 'Refreshed',
          description: 'Latest messages loaded',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.username) {
      fetchMessages()
      fetchAcceptMessage()
      fetchAnonShield()
      const baseUrl = `${window.location.protocol}//${window.location.host}`
      setProfileUrl(`${baseUrl}/user/${session.user.username}`)
    }
  }, [session])

  const handleSwitchChange = async () => {
    try {
      const response = await fetch('/api/accept-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptMessages: !acceptMessages }),
      })
      const data = await response.json()
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: 'Updated',
        description: data.message,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      })
    }
  }

  const handleAnonShieldChange = async () => {
    try {
      const response = await fetch('/api/anon-shield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonShield: !anonShield }),
      })
      const data = await response.json()
      setAnonShield(!anonShield)
      toast({
        title: 'Enabled',
        description: "Anon Shield is enabled",
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update Anon Shield settings',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'Copied',
      description: 'Profile URL copied to clipboard',
    })
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0A0F1C]">
        <Card className="w-full max-w-md bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <MessageSquare className="h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-gray-300 text-center">Please sign in to access your dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl mt-20 font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome back, {session.user.username}</p>
          </div>
          <Button
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full group"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
            Refresh Dashboard
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MessageSquare, title: 'Total Messages', value: stats.totalMessages, color: 'text-blue-400' },
            { icon: Bell, title: 'New Messages', value: stats.newMessages, color: 'text-green-400' },
            { icon: Users, title: 'Active Users', value: stats.activeUsers + "+" , color: 'text-purple-400' }
          ].map((stat, i) => (
            <Card key={i} className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm hover:bg-blue-900/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Link & Settings */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <LinkIcon className="mr-2 h-5 w-5 text-blue-400" />
                Share Your Profile
              </CardTitle>
              <CardDescription className="text-gray-400">
                Share this link to receive anonymous messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="pr-10 bg-blue-950/40 border-blue-900/50 text-white"
                  />
                  <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                </div>
                <Button 
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full group"
                >
                  <Clipboard className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="mr-2 h-5 w-5 text-blue-400" />
                Message Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control who can send you messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label htmlFor="accept-messages" className="font-medium text-white">
                    Accept Messages
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">
                    {acceptMessages ? "You're receiving messages" : "Messages are paused"}
                  </p>
                </div>
                <Switch
                  id="accept-messages"
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anon-shield" className="font-medium text-white">
                    Anon Shield
                  </Label>
                  <p className="text-sm text-gray-400 mt-1">
                    {anonShield ? "Anon Shield is enabled" : "Anon Shield is disabled"}
                  </p>
                </div>
                <Switch
                  id="anon-shield"
                  checked={anonShield}
                  onCheckedChange={handleAnonShieldChange}
                  disabled={isAnonShieldLoading}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section */}
        <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-400" />
                  Recent Messages
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Manage and respond to your messages
                </CardDescription>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map((message) => (
                  <MessageCards
                    key={message._id as string}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No messages yet</p>
                <p className="text-gray-500 mt-2">Share your profile link to start receiving messages</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

