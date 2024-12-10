import {
  totalItemSelectedInAOQ,
  useAbstractOfQuotation,
  useAllItemSelectedQuote,
  useDeleteAbstractOfQuotation,
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
import {
  Building2Icon,
  BuildingIcon,
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  Trash2Icon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const AllAbstract = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [aoqNo, setAoqNo] = useState<string | null>(null);

  const { data, isLoading: item_selected_loading } = useAllItemSelectedQuote();
  const { data: aoq_data } = useAbstractOfQuotation();
  const { mutate: deleteAOQMutation} = useDeleteAbstractOfQuotation();

  const navigate = useNavigate();
  const abstract = Array.isArray(aoq_data?.data) ? aoq_data.data : [];

  const totalItemsCount = (aoqNo: string) => {
    const items = Array.isArray(data?.data) ? data.data : [];
    return totalItemSelectedInAOQ(items, aoqNo!);
  };

  const totalAmount = (aoqNo: string) => {
    const items = Array.isArray(data?.data) ? data.data : [];
    const matchingItem = items.find((item) => item.aoq === aoqNo);
    return matchingItem?.total_amount || 0;
  };

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
            {item_selected_loading ? (
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
                        <TooltipProvider>
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
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <BuildingIcon className="w-4 h-4" />
                        <p>{data.rfq_details.supplier_name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="w-4 h-4" />
                        <p>{data.rfq_details.supplier_address}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCardIcon className="w-4 h-4 " />
                        <p>{data.rfq_details.tin}</p>
                      </div>
                    </div>
                    <Separator/>
                  </CardContent>
                  <CardFooter className="">
                    <div className="w-full">
                      <p className="text-sm font-semibold flex items-center space-x-1">
                        <Building2Icon className="w-4 h-4" />
                        <span>Quotation Summary</span>
                      </p>
                      <div className="flex justify-between">
                        <div className="gap-2 text-sm">
                          <p className="text-gray-600">
                            Total Items: {totalItemsCount(data.aoq_no)}
                          </p>
                          <p className="text-green-600 font-medium">
                            Total: ₱{totalAmount(data.aoq_no)}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          className="text-gray-400 opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-orange-100 group-hover:text-red-500"
                          onClick={() => handleOpenDialog(data.aoq_no)}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
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
