import {
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons"
import {CheckCircleIcon, CircleArrowUpIcon, CircleXIcon } from "lucide-react"


export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Forwarded to Procurement",
    label: "Forwarded",
    icon: CircleArrowUpIcon,
  },
  {
    value: "Approved",
    label: "Approved",
    icon: CheckCircleIcon,
  },
  {
    value: "Rejected",
    label: "Rejected",
    icon: CircleXIcon,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: CircleXIcon,
  },
]

