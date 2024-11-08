'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toaster';
import { signInSchema } from '@/schemas/signInSchema';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 lg:text-5xl mb-4">
            Welcome Back to Anonymous Feedback
          </h1>
          <p className="mb-6 text-gray-600">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} aria-label="Email or Username" />
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
                  <Input type="password" {...field} aria-label="Password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="w-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-500 transition duration-200" 
              type="submit" 
              disabled={loading}
              aria-live="polite" // To announce loading state
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 transition duration-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
