import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  purchaseRequestFormSchema,
  type PurchaseRequestData,
} from "@/types/request/purchase-request";
import { AddPurchaseRequest } from "@/services/purchaseRequestServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generatePrNo } from "@/services/generatePrNo";
import { toast } from "sonner";
import { chairmans } from "../data/list-of-chairman";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,  
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PurchaseRequestFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  lastPrNo: string | undefined;
}

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  lastPrNo,
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PurchaseRequestData>({
    resolver: zodResolver(purchaseRequestFormSchema),
  });

  const [open, setOpen] = React.useState(false);
  const [selectedChairman, setSelectedChairman] = React.useState("");
  const queryClient = useQueryClient();

  const addPurchaseRequestMutation = useMutation({
    mutationFn: AddPurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
      toast.success("Added Successfully", {
        description: "Purchase Request Added Successfully",
      });
      reset();
    },
  });

  const currentPurchaseNumber = lastPrNo && lastPrNo;

  const onSubmit = async (data: PurchaseRequestData) => {
    if (purchaseRequestFormSchema.safeParse(data).success) {
      setIsDialogOpen(false);
      addPurchaseRequestMutation.mutate({
        ...data,
        pr_status: "pending",
      });
    }
  };

  const renderField = (label: string, name: keyof PurchaseRequestData, component: React.ReactNode) => (
    <div>
      <Label>{label}</Label>
      {component}
      {errors[name] && (
        <span className="text-red-400 text-xs">
          {errors[name]?.message}
        </span>
      )}
    </div>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-full w-[45rem]">
        <ScrollArea className="h-[32rem] mb-8">
          <DialogHeader>
            <DialogTitle className="py-6">Create Purchase Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              {renderField("PR No.", "pr_no", (
                <Input {...register("pr_no")} value={generatePrNo(currentPurchaseNumber)} readOnly />
              ))}
              {renderField("Res Center Code", "res_center_code", <Input {...register("res_center_code")} />)}
              {renderField("Purpose", "purpose", <Textarea {...register("purpose")} />)}
              {renderField("Requested By", "requested_by", (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                      {selectedChairman || "Select Chairman"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search chairman..." />
                      <CommandList>
                        <CommandEmpty>No chairman found.</CommandEmpty>
                        <CommandGroup>
                          {chairmans.map((chairman) => (
                            <CommandItem
                              key={chairman.name}
                              value={chairman.name}
                              onSelect={(currentValue: string) => {
                                setSelectedChairman(currentValue === selectedChairman ? "" : currentValue);
                                setValue("requested_by", currentValue);
                                setOpen(false);
                              }}
                              {...register("requested_by")}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedChairman === chairman.name ? "opacity-100" : "opacity-0")} />
                              {chairman.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ))}
              {renderField("Approved By", "approved_by", <Input {...register("approved_by")} />)}
              <div className="mt-6 fixed bottom-6 right-10">
                <Button className="text-slate-950 bg-orange-200 hover:bg-orange-300" type="submit">
                  Submit Purchase Request
                </Button>
              </div>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseRequestForm;
