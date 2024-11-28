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
import { useLocation } from "react-router-dom";
import { DeleteDialog } from "./DeleteDialog";
import { CampusDirectorType } from "@/types/request/campus-director";
import { useDeleteCampusDirector } from "@/services/campusDirectorServices";
import EditCDForm from "./EditCDForm";

//Step 5: define the data props to users Type

interface CDDataTableRowActionsProps {
  id: string | undefined;
  _data: UsersType | CampusDirectorType;
}

export const CDDataTableRowActions = ({
  id,
  _data,
}: CDDataTableRowActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isEditDialogOpen, setIsEditDialogOpen ] =  useState<boolean>(false);
  const [cdId, setcdId] = useState<string>("");
  const location = useLocation();
  const usersPath = "/admin/users";
  const {mutate:cdMutation} = useDeleteCampusDirector()

  const handleOpenDropdown = () => {
    setIsDropdownOpen(true);
  };
  const handleDelete = () => {
    cdMutation(id!)
  };
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
   
  };

  const handleEditOpenDialog = () => {
    setIsEditDialogOpen(true);
    setcdId(id!);
   
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
          <div className="flex gap-4 bg-orange-200 rounded p-1 items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleEditOpenDialog}
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted hover:rounded-full"
                >
                  <Pencil1Icon className="h-4 w-4 text-orange-400" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Edit</TooltipContent>
            </Tooltip>

            <Separator className="h-8" orientation="vertical" decorative />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleOpenDialog}
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


      <DeleteDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        message="Campus Director"
        onDeleteClick={handleDelete}
      />

      <EditCDForm 
       isEditDialogOpen={isEditDialogOpen}
       setIsEditDialogOpen={setIsEditDialogOpen}
       cd_id={cdId}

      />

    </>

  );
};
