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
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import Loading from "../../shared/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Empty } from "../../shared/components/Empty";
import { DeleteDialog } from "../../shared/components/DeleteDialog";
import { AbstractFormEdit } from "./AbstractFormEdit";
import { useNavigate } from "react-router-dom";

export const AbstractItem = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedAbstract, setSelectedAbstract] = useState<string | null>(null)
  const [isOpenEditForm,  setIsOpenEditForm] = useState<boolean>(false)
  const { pr_no } = useParams();
  const { data } = useAllItemSelectedQuote();
  const { data: aoq_data, isLoading } = useAbstractOfQuotation();
  const { mutate } = useDeleteAbstractOfQuotation();
  const { toast } = useToast();
  const navigate = useNavigate()

  const abstract = useMemo(() => {
    if (aoq_data) {
      const items = Array.isArray(aoq_data?.data) ? aoq_data.data : [];
      return items.filter((item) => item.pr_details.pr_no === pr_no);
    }
  }, [aoq_data, pr_no]);

  const totalItemsCount = (aoqNo: string) => {
    const items = Array.isArray(data?.data) ? data.data : [];
    return totalItemSelectedInAOQ(items, aoqNo!);
  };

  const totalAmount = (aoqNo: string) => {
    const items = Array.isArray(data?.data) ? data.data : [];
    const filteredItems = items.filter(
      (item) => item.afq === aoqNo && item.is_item_selected
    );
    return filteredItems.reduce(
      (sum, item) => sum + Number(item.total_amount),
      0
    );
  };

  const handleOpenDialog = (aoq_no: string) => {
    setSelectedAbstract(aoq_no)
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    console.log("delete")
    mutate(selectedAbstract!);
    toast({
      title: "Success",
      description: "Abstract of Quotation successfully deleted.",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className=" rounded relative w-full">
      <div className=" pb-8">
        <p className="text-xl"> All Abstract of Quotation</p>
        <div className="grid grid-cols-4 gap-4 mt-8 w-full">
          {abstract && abstract.length > 0 ? (
            abstract.map((data) => (
              <Card className="group border shadow-md rounded-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xl font-semibold">
                        {data.rfq_details.supplier_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {data.afq_no}
                      </p>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <OpenInNewWindowIcon
                            width={20}
                            height={20}
                            onClick={() => navigate(`/bac/abstract-item-list/${data.afq_no}`)}
                            className="hover:cursor-pointer hover:text-orange-300 transition-colors duration-200"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">View Details</TooltipContent>
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
                    <p className="text-base font-semibold">Quotation Summary</p>
                    <p className="text-base text-gray-700">
                      Total Items: {totalItemsCount(data.afq_no)}
                      
                    </p>
                    <p className="text-base text-gray-700"></p>
                    <p className="text-base text-green-600 font-medium">
                      Total Price: {totalAmount(data.afq_no)}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="mt-2 border-t pt-2">
                  <div className="w-full flex justify-between items-center">
                    <p className="text-sm text-gray-500 italic">
                      {formatDate(data.created_at)}
                    </p>
                    <div className="flex space-x-2">
                      <div className="bg-red-200 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <TrashIcon
                          onClick={() => handleOpenDialog(data.afq_no)}
                          className="text-red-500"
                          width={20}
                          height={20}
                        />
                      </div>
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
        onDeleteClick={handleDelete}
        message={"Abstract of Quotation"}
      />

      <AbstractFormEdit isDialogOpen={isOpenEditForm} setIsDialogOpen={setIsOpenEditForm}/>
    </div>
  );
};
