'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface MessageCheckerProps {
  prompt?: string;
  onContentCheck?: (isAppropriate: boolean | null) => void;
}

export default function MessageChecker({ prompt = '', onContentCheck }: MessageCheckerProps) {
  const [data, setData] = useState<string>('Checking message...')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (prompt && prompt.trim()) {
      const timer = setTimeout(async () => {
        setError(null)
        setIsLoading(true)
        try {
          const response = await fetch('/api/messages-check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: `
                You are a content moderation assistant. Analyze the following message for appropriateness:

                "${prompt}"

                Consider the following criteria:
                1. Profanity or explicit language
                2. Hate speech or discriminatory content
                3. Personal attacks or bullying
                4. Potentially harmful or dangerous content
                5. Spam or irrelevant content

                Respond EXACTLY with one of these options:
                - "APPROPRIATE" if the message is acceptable.
                - "INAPPROPRIATE: [specific reason]" if the message violates any of the above criteria.

                Be thorough in your analysis and consistent in your judgments.
              `
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to check message content')
          }

          const responseData = await response.json()
          const responseText = responseData.response
          setData(responseText)
          
          if (onContentCheck) {
            onContentCheck(responseText.toLowerCase().startsWith('appropriate'))
          }
        } catch (error) {
          console.error('Error checking message:', error)
          setError('Failed to check message content')
          if (onContentCheck) {
            onContentCheck(null)
          }
        } finally {
          setIsLoading(false)
        }
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setData('Waiting for input...')
      if (onContentCheck) {
        onContentCheck(null)
      }
    }
  }, [prompt, onContentCheck])

  const getMessageStyle = () => {
    if (data.toLowerCase().startsWith('inappropriate')) {
      return 'text-red-400'
    }
    if (data.toLowerCase().startsWith('appropriate')) {
      return 'text-green-400'
    }
    return 'text-sky-400'
  }

  const getIcon = () => {
    if (data.toLowerCase().startsWith('inappropriate')) {
      return <XCircle className="w-6 h-6 text-red-400" />
    }
    if (data.toLowerCase().startsWith('appropriate')) {
      return <CheckCircle className="w-6 h-6 text-green-400" />
    }
    return <AlertCircle className="w-6 h-6 text-sky-400" />
  }

  return (
    <Card className="w-full bg-gray-800 border-gray-700 mb-4">
      <CardHeader>
        <CardDescription className="text-sky-400">Content moderation status</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center space-x-2 text-red-400">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-700" />
            <Skeleton className="h-4 w-[200px] bg-gray-700" />
          </div>
        ) : (
          <div className={`flex items-center space-x-2 ${getMessageStyle()}`}>
            {getIcon()}
            <span>{data}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}