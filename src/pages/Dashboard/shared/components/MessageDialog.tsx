import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertOctagon, Lightbulb, CheckCircle } from 'lucide-react'

interface MessageDialogProps {
  type: 'error' | 'success' | 'info'
  title: string
  message: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MessageDialog({ type, title, message, open, onOpenChange }: MessageDialogProps) {
  const iconMap = {
    error: <AlertOctagon className="h-12 w-12 text-red-300" />,
    success: <CheckCircle className="h-12 w-12 text-green-300" />,
    info: <Lightbulb className="h-12 w-12 text-orange-300" />
  }

  const bgColorMap = {
    error: 'bg-red-100',
    success: 'bg-green-100',
    info: 'bg-yellow-100'
  }

  const buttonColorMap = {
    error: 'bg-red-400 text-destructive-foreground hover:bg-destructive/90',
    success: 'bg-green-400 text-success-foreground hover:bg-success/90',
    info: 'bg-orange-400 text-warning-foreground hover:bg-warning/90'
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

