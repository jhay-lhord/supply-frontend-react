import { Loader2 } from "lucide-react"
export default function Loading() {
  return (
    <div className="grid place-items-center w-full h-96">
      <p className="flex"><Loader2 className="animate-spin" /> Loading...</p>
    </div>
  )
}

