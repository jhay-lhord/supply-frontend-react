import { Loader2 } from "lucide-react"
export default function Loading() {
  return (
    <div className="grid place-items-center w-full h-96 z-20">
      <p className="flex"><Loader2 className="animate-spin mx-2" /> Loading...</p>
    </div>
  )
}

