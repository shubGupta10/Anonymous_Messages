'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { Loader2, RefreshCcw, Link as LinkIcon, Clipboard, MessageSquare, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import MessageCards from '@/components/MessageCards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState<string>('')

  const { toast } = useToast()
  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
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

  const fetchMessages = async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/get-messages')
      const data = await response.json()
      setMessages(data.messages || [])
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
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
    if (session && session.user) {
      fetchMessages()
      fetchAcceptMessage()
  
      const username = session.user.username
      if (username) {
        const baseUrl = `${window.location.protocol}//${window.location.host}`
        setProfileUrl(`${baseUrl}/u/${username}`)
      }
    }
  }, [session])

  const handleSwitchChange = async () => {
    try {
      const response = await fetch('/api/accept-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acceptMessages: !acceptMessages }),
      })
      const data = await response.json()
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: 'Success',
        description: data.message,
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update message settings',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'URL Copied',
      description: 'Profile URL has been copied to clipboard',
    })
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Card className="w-full max-w-md bg-gray-800 text-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <MessageSquare className="h-12 w-12 text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold text-center mb-2">Login Required</h2>
            <p className="text-center text-gray-400">Please login to view your dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">User Dashboard</h1>
    
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <LinkIcon className="mr-2 h-5 w-5" />
                Your Unique Profile Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-grow w-full">
                  <Input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="pr-10 bg-gray-700 text-white border-gray-600"
                    aria-label="Profile URL"
                  />
                  <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <Button 
                  onClick={copyToClipboard} 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
    
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <Settings className="mr-2 h-5 w-5" />
                Message Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="accept-messages" className="font-medium text-white">Accept Messages</Label>
                <Switch
                  id="accept-messages"
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {acceptMessages ? "You're currently accepting messages." : "You're not accepting messages at the moment."}
              </p>
            </CardContent>
          </Card>
        </div>
    
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-blue-400">
              <MessageSquare className="mr-2 h-5 w-5" />
              Your Messages
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <Separator className="my-4 bg-gray-700" />
            {messages && messages.length > 0 ? (
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
              <div className="text-center py-8">
                <p className="text-gray-400">No messages to display.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}