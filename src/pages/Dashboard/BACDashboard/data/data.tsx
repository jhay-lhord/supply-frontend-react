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
    value: "accepted",
    label: "Accepted",
    icon: CircleIcon,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: StopwatchIcon,
  },

]

