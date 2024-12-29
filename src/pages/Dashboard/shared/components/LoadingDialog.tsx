import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface LoadingDialogProps {
  open: boolean
  message: string
}

const LoadingDialog = ({ open, message }: LoadingDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-lg font-semibold text-center">{message}</h2>
          <p className="text-sm text-muted-foreground text-center">
            Please wait while we process your request.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoadingDialog

