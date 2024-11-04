'use client';

import MessageCards from '@/components/MessageCards';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Link as LinkIcon, Clipboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>(''); 

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const fetchMessages = async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
      fetchAcceptMessage();
  
      const username = session.user.username;
      if (username) {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        setProfileUrl(`${baseUrl}/u/${username}`);
      }
    }
  }, [session]);
  
  

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied',
      description: 'Profile URL has been copied to clipboard',
    });
  };

  if (!session || !session.user) {
    return <div className="flex justify-center items-center h-screen">Please login to view your dashboard</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">User Dashboard</h1>
  
      {/* Profile Link Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Unique Profile Link</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              aria-label="Profile URL"
            />
            <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Button 
            onClick={copyToClipboard} 
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </div>
  
      {/* Message Settings Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Message Settings</h2>
        <div className="flex items-center justify-between">
          <span className="font-medium">Accept Messages</span>
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className={`transition duration-200 ${isSwitchLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {acceptMessages ? "You're currently accepting messages." : "You're not accepting messages at the moment."}
        </p>
      </div>
  
      {/* Messages Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Messages</h2>
          <Button
            variant="outline"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className={`flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        <Separator className="my-4" />
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
            <p className="text-gray-500">No messages to display.</p>
          </div>
        )}
      </div>
    </div>
  );
  };

export default Page;
