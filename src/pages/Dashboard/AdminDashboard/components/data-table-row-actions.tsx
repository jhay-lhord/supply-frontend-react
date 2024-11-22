import { useState } from "react";
import {
  ArrowTopRightIcon,
  DotsVerticalIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { UsersType } from "@/types/response/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { useActivateUser } from "@/services/userServices";
import { RequisitionerType } from "@/types/request/requisitioner";
import { useLocation } from "react-router-dom";

//Step 5: define the data props to users Type

interface DataTableRowActionsProps {
  id: string | undefined;
  _data: UsersType | RequisitionerType;
}

export const DataTableRowActions = ({
  id,
  _data,
}: DataTableRowActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const location = useLocation();
  const usersPath = "/admin/users";

  const handleOpenDropdown = () => {
    setIsDropdownOpen(true);
  };

  const buttonLabel = (_data as UsersType).is_active
    ? "Deactivate"
    : "Activate";
  const { mutate, isPending } = useActivateUser(buttonLabel);

  const handleActivateUser = () => {
    mutate({ id: id!, status: !(_data as UsersType).is_active });
  };

  return (
    <>
      {location.pathname === usersPath ? (
        <TooltipProvider delayDuration={100} skipDelayDuration={200}>
          <div className="flex gap-4 ">
            <div
              className={`flex ${
                (_data as UsersType).is_active
                  ? "bg-red-200 hover:bg-red-200"
                  : "bg-green-200 hover:bg-green-200"
              }  rounded items-center`}
            >
              <Button
                onClick={handleActivateUser}
                className={`${
                  (_data as UsersType).is_active
                    ? "bg-red-200 hover:bg-red-200"
                    : "bg-green-200 hover:bg-green-200"
                }  text-slate-950 `}
              >
                {isPending ? <Loader2 className="animate-spin" /> : buttonLabel}
              </Button>
              <Separator className="" orientation="vertical" decorative />

              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu
                    open={isDropdownOpen}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full"
                        onClick={handleOpenDropdown}
                      >
                        <DotsVerticalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Menu Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Open</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent side="top">Open Menu</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      ) : (
        <TooltipProvider  delayDuration={100} skipDelayDuration={200}>
          <div className="flex gap-4 bg-orange-200 rounded p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full"
                >
                  <ArrowTopRightIcon className="h-4 w-4 text-orange-400" />
                  <span className="sr-only">Open</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Open</TooltipContent>
            </Tooltip>

            <Separator className="h-8" orientation="vertical" decorative />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full text-orange-400 hover:bg-red-400 hover:text-gray-100"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Delete</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}
    </>
  );
};
