'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Send, MessageSquare, UserPlus, AlertCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CardHeader, CardContent, Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import * as z from 'zod'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { messageSchema } from '@/schemas/messageSchema'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import MessageChecker from '@/components/MessageChecker'

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username
  const { toast } = useToast()
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([])
  const [isContentAppropriate, setIsContentAppropriate] = useState<boolean | null>(null)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const messageContent = form.watch('content')

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMessages, setIsFetchingMessages] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, username }),
      })
      const responseData = await response.json()

      toast({
        title: 'Success',
        description: responseData.message,
        variant: 'default',
      })
      form.reset({ ...form.getValues(), content: '' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    setIsFetchingMessages(true)
    setError(null)
    try {
      const response = await fetch('/api/suggest-messages', { method: 'POST' })
      const data = await response.json()
      
      if (data.content) {
        const messages = String(data.content).split('||').map(msg => msg.trim())
        setSuggestedMessages(messages)
        
        toast({
          title: 'Success',
          description: 'Successfully loaded suggested messages',
          variant: 'default',
        })
      } else {
        throw new Error('No content in response')
      }
    } catch (error) {
      console.error('Error details:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch suggested messages'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsFetchingMessages(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-blue-500/20">
          <CardHeader className="p-8 bg-gradient-to-r from-blue-600 to-blue-800">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-2">Send a Message</h1>
            <p className="text-center text-lg text-blue-100">
              to <span className="font-semibold">@{username}</span>
            </p>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <MessageChecker 
              prompt={messageContent} 
              onContentCheck={(isAppropriate: any) => setIsContentAppropriate(isAppropriate)}
            />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-semibold text-blue-300">Your Anonymous Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here..."
                          className="resize-none h-36 bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-blue-400" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent || isContentAppropriate === false}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {isContentAppropriate === false ? 'Content Inappropriate' : 'Send Message'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {error && (
              <Alert variant="destructive" className="mt-6 bg-red-900/50 border border-red-500 text-red-100">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
                <AlertDescription className="text-base">{error}</AlertDescription>
              </Alert>
            )}

            <Separator className="my-8 bg-blue-500/20" />

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-2xl font-semibold text-blue-300">Need Inspiration?</h3>
                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isFetchingMessages}
                  variant="outline"
                  className="w-full sm:w-auto bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30 transition-colors duration-200 text-lg py-2 px-4"
                >
                  {isFetchingMessages ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Suggest Messages
                    </>
                  )}
                </Button>
              </div>
              <p className="text-base text-blue-400">Click on any message below to use it.</p>
              <div className="grid grid-cols-1 gap-3 mt-4">
                {suggestedMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left h-auto py-3 px-4 bg-blue-900/30 text-blue-200 border-blue-500/30 hover:bg-blue-800/40 transition-colors duration-200 overflow-hidden text-ellipsis text-base"
                    onClick={() => handleMessageClick(message)}
                  >
                    <span className="block truncate">{message}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900 shadow-2xl rounded-3xl overflow-hidden border border-blue-400/30">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Create Your Own Message Board</h2>
              <p className="text-xl text-blue-200">Join now and start receiving anonymous messages!</p>
              <Link href="/sign-up" className="inline-block">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-xl shadow-lg">
                  <UserPlus className="mr-2 h-6 w-6" />
                  Create Your Account
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

