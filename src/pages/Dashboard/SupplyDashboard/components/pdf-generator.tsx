import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText } from "lucide-react";


export default function FloatingPDFGenerator() {

  return (
    <div className="fixed bottom-8 right-8 z-50 ">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <Button
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/90 hover:shadow-xl"
              aria-label="Generate PDF"
            >
              <FileText className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate PDF</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
