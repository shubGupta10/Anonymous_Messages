'use client'
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z  from 'zod';

const page = () => {
    const router = useRouter();
    const params = useParams<{username: string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
      })

      const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast({
              title: "Success",
              description: response.data.message
          })

            router.replace("/sign-in");
        } catch (error) {
            console.error("Error in Signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast({
              title: 'Verification Failed',
              description:
                axiosError.response?.data.message ??
                'An error occurred. Please try again.',
              variant: 'destructive',
            });
        }
      }
      return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-100">
          <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-lg shadow-lg transition-transform duration-200 hover:shadow-xl">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 lg:text-5xl mb-4">
                Verify Your Account
              </h1>
              <p className="text-gray-600 mb-6">
                Enter the verification code sent to your email
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Verification Code</FormLabel>
                      <Input
                        {...field}
                        className="border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your code"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-500 transition duration-200 rounded-md py-2"
                >
                  Verify
                </Button>
              </form>
            </Form>
          </div>
        </div>
      );
}

export default page