'use client'
import React, { useEffect, useState } from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import {useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, LockIcon, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const page = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const debounced = useDebounceCallback(setUsername, 300)
  
  const {toast} = useToast();
  const router = useRouter();


  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username){
          setIsCheckingUsername(true)
          setUsernameMessage('')
          try {
            const response = await axios.get(`/api/check-username-unique?username=${username}`)
            setUsernameMessage(response.data.message)
          } catch (error) {
             const axiosError = error as AxiosError<ApiResponse>;
             setUsernameMessage(
              axiosError.response?.data.message ?? "Error Checking username"
             )
          }finally{
            setIsCheckingUsername(false);
          }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
        const response = await axios.post<ApiResponse>('/api/sign-up', data)
        toast({
          title: 'Success',
          description: response.data.message
        })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
    } catch (error) {
      console.error("Error in Signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast ({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive'
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">
            Join Anonymous Feedback
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign up to start your anonymous adventure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            debounced(e.target.value)
                          }}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Choose a username"
                        />
                      </div>
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin mt-2 text-blue-400" />}
                    {!isCheckingUsername && usernameMessage && (
                      <p className={`text-sm mt-1 ${
                        usernameMessage === 'Username is unique' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Enter your email"
                        />
                      </div>
                    </FormControl>
                    <p className='text-gray-400 text-sm mt-1'>We'll send you a verification code</p>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          {...field}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Create a password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-400">Already a member? </span>
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default page