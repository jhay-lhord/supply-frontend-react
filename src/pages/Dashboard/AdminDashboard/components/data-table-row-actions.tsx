import { useState } from "react";
import {
  Pencil1Icon,
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
import { DeleteDialog } from "./DeleteDialog";
import { useDeleteRequisitioner } from "@/services/requisitionerServices";
import EditRequisitionerForm from "./EditRequisitionerForm";

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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isEditDialogOpen, setIsEditDialogOpen ] =  useState<boolean>(false);
  const [requisitionId, setRequisitionId] = useState<string>("");
  const location = useLocation();
  const usersPath = "/admin/users";
  const {mutate:requisitionerMutation} = useDeleteRequisitioner()

  const handleOpenDropdown = () => {
    setIsDropdownOpen(true);
  };
  const handleDelete = () => {
    requisitionerMutation(id!)
  };
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
   
  };

  const handleEditOpenDialog = () => {
    setIsEditDialogOpen(true);
    setRequisitionId(id!);
   
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
        <TooltipProvider delayDuration={100} skipDelayDuration={200}>
          <div className="flex gap-11 bg-orange-200 rounded p-1 items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                 
                  onClick={handleEditOpenDialog}
                  className="flex  h-8 w-8 p-0 hover:bg-orange-200"
                >
                  <div className="flex items-center justify-center gap-1 ml-11 ">
                    Edit
                  <Pencil1Icon className="h-5 w-5" />
                  
                  </div>
                </Button>
              </TooltipTrigger>
       
            </Tooltip>

            <Separator className="h-8" orientation="vertical" decorative />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
           
                  onClick={handleOpenDialog}
                  className="flex  h-8 w-8 p-0 hover:bg-orange-200"
                >
                  <div className="flex items-center justify-center gap-1 mr-10">
                  <TrashIcon className="h-5 w-5" />
                  Delete
                  </div>
                </Button>
              </TooltipTrigger>
            
            </Tooltip>
          </div>
        </TooltipProvider>
      )}


      <DeleteDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        message="requisitioner"
        onDeleteClick={handleDelete}
      />

      <EditRequisitionerForm 
       isEditDialogOpen={isEditDialogOpen}
       setIsEditDialogOpen={setIsEditDialogOpen}
       requisition_id={requisitionId}

      />

    </>

  );
};
