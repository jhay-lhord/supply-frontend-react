import {
  totalItemSelectedInAOQ,
  useAbstractOfQuotation,
  useAllItemSelectedQuote,
  useDeleteAbstractOfQuotation,
} from "@/services/AbstractOfQuotationServices";
import { OpenInNewWindowIcon, TrashIcon } from "@radix-ui/react-icons";
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
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import { Empty } from "../shared/components/Empty";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "./components/Layout/BACDashboardLayout";
import Loading from "../shared/components/Loading";
import { useState } from "react";
import { DeleteDialog } from "../shared/components/DeleteDialog";

export const AllAbstract = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false) 
  const [aoqNo, setAoqNo] = useState<string | null >(null)

  const { data, isLoading: item_selected_loading } = useAllItemSelectedQuote();
  const { data: aoq_data } = useAbstractOfQuotation();
  const { mutate } = useDeleteAbstractOfQuotation()

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

  const handleOpenDialog = (aoq_no:string) => {
    setIsDialogOpen(true)
    setAoqNo(aoq_no)
  }

  const handleDelete = () => {
    mutate(aoqNo!)
  }

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
                <Card className="group border shadow-md rounded-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xl font-semibold">
                          {data.rfq_details.supplier_name}
                        </p>
                        <p className="text-sm text-gray-500">{data.aoq_no}</p>
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
                  </CardHeader>

                  <CardContent className="mt-2">
                    <p className="text-base font-medium">
                      Supplier Address:
                      <span className="text-gray-600">
                        {data.rfq_details.supplier_address}
                      </span>
                    </p>
                    <p className="text-base font-medium">
                      TIN:
                      <span className="text-gray-600">
                        {data.rfq_details.tin}
                      </span>
                    </p>
                    <div className="mt-4 border-t pt-2">
                      <p className="text-base font-semibold">
                        Quotation Summary
                      </p>
                      <p className="text-base text-gray-700">
                        Total Items: {totalItemsCount(data.aoq_no)}
                      </p>
                      <p className="text-base text-gray-700"></p>
                      <p className="text-base text-green-600 font-medium">
                        Total Price: {totalAmount(data.aoq_no)}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="mt-2 border-t pt-2">
                    <div className="w-full flex items-center">
                      <div className="w-full flex justify-between items-center">
                        <p className="text-sm text-gray-500 italic">
                          {formatDate(data.created_at)}
                        </p>
                      </div>
                      <div className="bg-red-200 rounded-full p-2 opacity-0 group-hover:opacity-100 ease-in-out cursor-pointer">
                        <TrashIcon
                          className=""
                          width={20}
                          height={20}
                          onClick={() => handleOpenDialog(data.aoq_no)}
                        />
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
