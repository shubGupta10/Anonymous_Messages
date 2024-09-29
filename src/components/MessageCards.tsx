import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

const MessageCards = ({ message, onMessageDelete }: MessageCardProp) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-messages/${message._id}`)
      toast({
        title: response.data.message,
      })
      onMessageDelete(message._id as string);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="relative">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="absolute top-2 right-2 p-2">
            <X className='w-4 h-4' />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CardContent className="pt-10">
        <p>{message.content}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">Received: {new Date(message.createdAt).toLocaleString()}</p>
      </CardFooter>
    </Card>
  )
}

export default MessageCards