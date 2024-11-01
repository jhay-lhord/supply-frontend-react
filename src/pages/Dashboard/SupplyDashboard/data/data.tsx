import {
  CircleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"


export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Forwarded to Procurement",
    label: "Forwarded to Procurement",
    icon: CircleIcon,
  },
  {
    value: "Ready for Canvassing",
    label: "Ready for Canvassing",
    icon: CircleIcon,
  },
  {
    value: "Ready for Purchase Order",
    label: "Ready for Purchase Order",
    icon: StopwatchIcon,
  },

]

