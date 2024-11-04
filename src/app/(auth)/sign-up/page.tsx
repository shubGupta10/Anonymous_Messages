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
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //we are using useDebounce so we want that when user enter the username it check for uniqunes as we difined but we dont want  it to got everytime so we using useDebounce

  const debounced = useDebounceCallback(setUsername, 300)
  
  const {toast} = useToast();
  const router = useRouter();

  //zod implementation

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
  <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-lg shadow-lg transition-transform duration-200 hover:shadow-xl">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 lg:text-5xl mb-4">
        Join Anonymous Feedback
      </h1>
      <p className="mb-4 text-gray-600">Sign up to start your anonymous adventure</p>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  debounced(e.target.value);
                }}
                className="border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {isCheckingUsername && <Loader2 className="animate-spin mt-2" />}
              {!isCheckingUsername && usernameMessage && (
                <p
                  className={`text-sm mt-1 ${
                    usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {usernameMessage}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input {...field} name="email" className="border rounded-md focus:ring-2 focus:ring-blue-500" />
              <p className='text-gray-600 text-sm mt-1'>We will send you a verification code</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...field} name="password" className="border rounded-md focus:ring-2 focus:ring-blue-500" />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-blue-600 text-white hover:bg-blue-500 transition duration-200 rounded-md py-2 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
      <p className="text-gray-600">
        Already a member?{' '}
        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 transition duration-200">
          Sign in
        </Link>
      </p>
    </div>
  </div>
</div>
  );
}

export default page