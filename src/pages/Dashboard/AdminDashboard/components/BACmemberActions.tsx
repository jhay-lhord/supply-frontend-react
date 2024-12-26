import { useState } from "react";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { UsersType } from "@/types/response/users";
import { DeleteDialog } from "./DeleteDialog";

import { BACmemberType } from "@/types/request/BACmember";

import { useDeleteBACmember } from "@/services/BACmemberServices";

import EditBACmemberForm from "./EditBACmemberForm";


interface BACDataTableRowActionsProps {
  id: string | undefined;
  _data: UsersType | BACmemberType;
}

export const BACDataTableRowActions = ({ id }: BACDataTableRowActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [BACId, setBACId] = useState<string>("");

  const { mutate: BACMutation } = useDeleteBACmember();

  const handleDelete = () => {
    BACMutation(id!);
  };
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleEditOpenDialog = () => {
    setIsEditDialogOpen(true);
    setBACId(id!);
  };

  return (
    <>
      <TooltipProvider delayDuration={100} skipDelayDuration={200}>
        <div className="flex gap-1   p-1 items-center justify-center w-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-5">
                <Button onClick={handleEditOpenDialog}>
                  <Pencil1Icon className="h-4 w-4 mr-1" />
                  <p className="text-xs">Edit</p>
                </Button>
              </div>
            </TooltipTrigger>

            <Separator className="h-8" orientation="vertical" decorative />

            <TooltipTrigger asChild>
              <div
                className="flex items-center gap-5"
                onClick={handleOpenDialog}
              >
                <Button className="bg-red-300 hover:bg-red-300">
                  <TrashIcon className="h-4 w-4" />
                  <p className="text-xs">Delete</p>
                </Button>
              </div>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </TooltipProvider>

      <DeleteDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        message="BAC Member"
        onDeleteClick={handleDelete}
      />

      <EditBACmemberForm
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        member_id={BACId}
      />
    </>
  );
};
