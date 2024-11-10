'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Send, MessageSquare, UserPlus, AlertCircle } from 'lucide-react'
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

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username
  const { toast } = useToast()
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([])
  const [isContentValid, setIsContentValid] = useState(false);

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
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-700">
          <CardHeader className="p-6 bg-blue-600">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">Send a Message</h1>
            <p className="text-center mt-2 text-blue-100">
              to @{username}
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base sm:text-lg font-semibold text-blue-300">Your Anonymous Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here..."
                          className="resize-none h-24 sm:h-32 bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
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
                    disabled={isLoading || !messageContent}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {error && (
              <Alert variant="destructive" className="mt-4 bg-red-900 border-red-700 text-red-100">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Separator className="my-6 sm:my-8 bg-gray-700" />

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-300">Need Inspiration?</h3>
                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isFetchingMessages}
                  variant="outline"
                  className="w-full sm:w-auto bg-gray-700 text-blue-300 border-gray-600 hover:bg-gray-600 transition-colors duration-200"
                >
                  {isFetchingMessages ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Suggest Messages
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-blue-400">Click on any message below to use it.</p>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {suggestedMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left h-auto py-2 px-3 bg-gray-700 text-blue-200 border-gray-600 hover:bg-gray-600 transition-colors duration-200 overflow-hidden text-ellipsis"
                    onClick={() => handleMessageClick(message)}
                  >
                    <span className="block truncate">{message}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-blue-300 mb-4 text-base sm:text-lg">Want your own message board?</p>
          <Link href="/sign-up">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-base sm:text-lg">
              <UserPlus className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}