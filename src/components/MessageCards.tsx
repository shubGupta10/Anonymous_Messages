import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Trash2, Clock } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

const MessageCards = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-messages/${message._id}`)
      toast({
        title: "Success",
        description: response.data.message,
        className: "bg-blue-500 text-white",
      })
      onMessageDelete(message._id as string);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
        className: "bg-red-500 text-white",
      })
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-[#0f1833] to-[#0a0f1c] text-white border border-blue-400/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      <CardContent className="pt-8 pb-6 px-6">
        <p className="text-gray-100 leading-relaxed text-2xl font-light">{message.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-[#0a0f1c]/80 py-4 px-6 backdrop-blur-sm">
        <div className="flex items-center text-sm text-blue-300">
          <Clock className="w-4 h-4 mr-2" />
          <p>
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-300 hover:text-blue-100 hover:bg-blue-600/30 transition-colors rounded-full"
            >
              <Trash2 className="w-5 h-5" />
              <span className="sr-only">Delete message</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#0f1833] border border-blue-400/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold text-white">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="bg-[#0a0f1c] text-white border-blue-400/30 hover:bg-blue-800/50 hover:border-blue-400/50 transition-colors">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

export default MessageCards

