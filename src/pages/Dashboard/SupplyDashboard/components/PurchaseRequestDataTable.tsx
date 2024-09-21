import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getPurchaseRequest } from "@/services/purchaseRequestServices";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { useState, useEffect } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PurchaseRequestDataTable() {
  const [purchaseRequest, setPurchaseRequest] = useState<purchaseRequestType[]>(
    []
  );

  useEffect(() => {
    const fetchPurchaseRequest = async () => {
      const response = await getPurchaseRequest();

      if (response.status === "success") {
        const responseInArray = Array.isArray(response.data)
          ? response.data
          : [];
        setPurchaseRequest(responseInArray);
      }
    };
    fetchPurchaseRequest();
  }, []);

  return (
    <>
      <div className="hidden w-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex justify-between w-full">
            <h2 className="text-2xl font-bold tracking-tight">
              Purchase Request
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-6 bg-orange-200 hover:bg-orange-300 text-black">
                  <PlusIcon className="mr-2"></PlusIcon>Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] ">
                <DialogHeader>
                  <DialogTitle>Add Purchase Request</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <DataTable data={purchaseRequest} columns={columns} />
      </div>
    </>
  );
}
