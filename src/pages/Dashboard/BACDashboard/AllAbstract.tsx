import {
  useAbstractOfQuotation,
  useDeleteAbstractOfQuotation,
  useGetAllSupplierItem,
} from "@/services/AbstractOfQuotationServices";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import { Empty } from "../shared/components/Empty";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "./components/Layout/BACDashboardLayout";
import Loading from "../shared/components/Loading";
import { useState } from "react";
import { DeleteDialog } from "../shared/components/DeleteDialog";
import { BuildingIcon, CalendarIcon, Loader2, TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const AllAbstract = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [aoqNo, setAoqNo] = useState<string | null>(null);

  const { data: aoq_data, isLoading } = useAbstractOfQuotation();
  const { data: supplier_item, isLoading: supplier_loading } = useGetAllSupplierItem();
  const { mutate: deleteAOQMutation } = useDeleteAbstractOfQuotation();

  const supplierData = Array.isArray(supplier_item?.data) ? supplier_item.data : [];

  const supplierName = (aoq_no: string) => {
    const names = new Set(
      supplierData
        .filter((data) => data.supplier_details.aoq_details.aoq_no === aoq_no)
        .map((data) => data.rfq_details.supplier_name)
    );
    return Array.from(names);
  };

  const navigate = useNavigate();
  const abstract = Array.isArray(aoq_data?.data) ? aoq_data.data : [];

  const handleOpenDialog = (aoq_no: string) => {
    setIsDialogOpen(true);
    setAoqNo(aoq_no);
  };

  const handleDelete = () => {
    deleteAOQMutation(aoqNo!);
  };

  return (
    <Layout>
      <div className=" rounded relative w-full">
        <div className=" pb-8">
          <p className="text-xl"> All Abstract of Quotation</p>
          <div className="grid grid-cols-3 gap-4 mt-8 w-full">
            {isLoading ? (
              <Loading />
            ) : abstract && abstract.length > 0 ? (
              abstract.map((data) => (
                <Card className="group">
                  <CardHeader className="">
                    <CardTitle>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p>{data.aoq_no}</p>
                          </div>
                          <div className="flex gap-2 items-center text-sm font-thin ">
                            <CalendarIcon className="w-4 h-4" />
                            <p>{formatDate(data.created_at)}</p>
                          </div>
                        </div>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="bg-orange-200 p-2"
                                onClick={() =>
                                  navigate(
                                    `/bac/abstract-item-list/${data.aoq_no}`
                                  )
                                }
                              >
                                <p className="px-2">View</p>
                                <OpenInNewWindowIcon
                                  width={20}
                                  height={20}
                                  className="hover:cursor-pointer hover:text-orange-300 transition-colors duration-200"
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              View Details
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-4 ">
                    <p>All Suppliers</p>
                    {supplier_loading ? (
                      <p className="flex">
                        <Loader2 className="animate-spin mx-2" /> Loading...
                      </p>
                    ) : (
                      supplierName(data.aoq_no).map((name) => (
                        <div className="flex items-center space-x-2">
                          <BuildingIcon className="w-4 h-4" />
                          <p>{name}</p>
                        </div>
                      ))
                    )}
                    <Separator />
                  </CardContent>
                  <CardFooter className="flex items-center justify-center">
                    <div className=" opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <TrashIcon
                        onClick={() => handleOpenDialog(data.aoq_no)}
                        className="text-red-500 bg-red-200 rounded-full p-2"
                        width={30}
                        height={30}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Empty message="No Abstract of Quotation found" />
            )}
          </div>
        </div>
        <DeleteDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          message="Abstarct of Quotation"
          onDeleteClick={handleDelete}
        />
      </div>
    </Layout>
  );
};
