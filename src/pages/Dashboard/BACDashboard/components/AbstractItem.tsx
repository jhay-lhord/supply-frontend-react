import {
  useAbstractOfQuotation,
  useDeleteAbstractOfQuotation,
  useGetAllSupplier,
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
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import Loading from "../../shared/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Empty } from "../../shared/components/Empty";
import { DeleteDialog } from "../../shared/components/DeleteDialog";
import { useNavigate } from "react-router-dom";
import {
  BuildingIcon,
  CalendarIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const AbstractItem = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedAbstract, setSelectedAbstract] = useState<string | null>(null);
  const { pr_no } = useParams();
  const { data: aoq_data, isLoading } = useAbstractOfQuotation();
  const { data: supplier } = useGetAllSupplier();
  const { mutate } = useDeleteAbstractOfQuotation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const supplierData = Array.isArray(supplier?.data) ? supplier.data : [];

  const supplierName = supplierData.map(
    (data) => data.rfq_details.supplier_name
  );

  const abstractData = useMemo(() => {
    if (aoq_data) {
      const items = Array.isArray(aoq_data?.data) ? aoq_data.data : [];
      return items.filter((item) => item.pr_details.pr_no === pr_no);
    }
  }, [aoq_data, pr_no]);

  const handleOpenDialog = (aoq_no: string) => {
    setSelectedAbstract(aoq_no);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    console.log("delete");
    mutate(selectedAbstract!);
    toast({
      title: "Success",
      description: "Abstract of Quotation successfully deleted.",
    });
  };

  return (
    <div className=" rounded relative w-full">
      <div className=" pb-8">
        <p className="text-xl"> Abstract of Quotation in [{pr_no}]</p>
        <div className="grid grid-cols-3 gap-4 mt-8 w-full">
          {isLoading ? (
            <Loading />
          ) : abstractData && abstractData.length > 0 ? (
            abstractData.map((data) => (
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
                  {supplierName.map((name) => (
                    <div className="flex items-center space-x-2">
                      <BuildingIcon className="w-4 h-4" />
                      <p>{name}</p>
                    </div>
                  ))}
                  <Separator/>
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                    <div className=" opacity-0 p-2 group-hover:opacity-100 transition-opacity cursor-pointer">
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
  );
};
