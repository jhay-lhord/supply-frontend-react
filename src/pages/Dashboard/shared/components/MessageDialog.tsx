import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertOctagon, ThumbsUp, Lightbulb } from 'lucide-react'

interface MessageDialogProps {
  type: 'error' | 'success' | 'info'
  title: string
  message: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MessageDialog({ type, title, message, open, onOpenChange }: MessageDialogProps) {
  const iconMap = {
    error: <AlertOctagon className="h-12 w-12 text-destructive" />,
    success: <ThumbsUp className="h-12 w-12 text-success" />,
    info: <Lightbulb className="h-12 w-12 text-warning" />
  }

  const bgColorMap = {
    error: 'bg-red-50',
    success: 'bg-green-50',
    info: 'bg-yellow-50'
  }

  const buttonColorMap = {
    error: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    success: 'bg-success text-success-foreground hover:bg-success/90',
    info: 'bg-warning text-warning-foreground hover:bg-warning/90'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] rounded-3xl ${bgColorMap[type]} p-6`}>
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="mb-4">
            {iconMap[type]}
          </div>
          <DialogTitle className="text-2xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button 
            onClick={() => onOpenChange(false)} 
            className={`w-full sm:w-auto text-lg py-2 px-6 rounded-full ${buttonColorMap[type]}`}
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

