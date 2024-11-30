import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  CheckIcon,
  Cross2Icon,
  OpenInNewWindowIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  useDeleteRequestForQuotation,
  useGetItemQuotation,
  useRequestForQoutation,
} from "@/services/requestForQoutationServices";
import { formatDate } from "@/services/formatDate";
import Loading from "../../shared/components/Loading";
import { useGetItemInPurchaseRequest } from "@/services/itemServices";
import { useParams } from "react-router-dom";
import { ItemType } from "@/types/request/item";
import { itemQuotationResponseType } from "@/types/response/request-for-qoutation";
import { useNavigate } from "react-router-dom";
import { DeleteDialog } from "../../shared/components/DeleteDialog";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const getLowPriceSummary = (
  items: ItemType[],
  itemQuotation: itemQuotationResponseType[],
  rfq_no: string
) => {
  const _items = items.length;
  const itemHasLowPrice = itemQuotation.filter(
    (data) => data.rfq === rfq_no && data.is_low_price === true
  ).length;

  if (items.length === 0)
    return <p className="text-sm text-orange-400">Processing...</p>;
  return (
    <div
      className={`rounded-md ${
        !itemHasLowPrice ? "text-red-400" : "text-green-400"
      }  p-2 w-full `}
    >
      <p className="flex gap-2 items-center">
        {!itemHasLowPrice ? <Cross2Icon /> : <CheckIcon />}
        {`${itemHasLowPrice ?? 0} of ${_items} Items has low price`}
      </p>
    </div>
  );
};

interface QuotationCardProps {
  isDeleteAllowed?: boolean;
  title: string;
}

export const QuotationCard: React.FC<QuotationCardProps> = ({
  isDeleteAllowed,
  title = "All Quotes",
}) => {
  const { pr_no } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(
    null
  );

  const { data: items, isLoading: item_loading } = useGetItemInPurchaseRequest(
    pr_no!
  );
  const { data } = useRequestForQoutation();
  const { data: item, isLoading } = useGetItemQuotation();
  const { mutate } = useDeleteRequestForQuotation();

  const _items = Array.isArray(items?.data) ? items.data : [];
  const itemQuotations = Array.isArray(item?.data) ? item?.data : [];

  const filteredQuotations = useMemo(() => {
    const quotations = Array.isArray(data?.data) ? data?.data : [];
    return quotations.filter((item) => item.purchase_request === pr_no);
  }, [data?.data, pr_no]);

  const handleDeleteClick = () => {
    mutate(selectedQuotation!);
    toast({
      title: "Success",
      description: "Request of Quotation Successfully deleted",
    });
  };

  const handleOpenDialog = (rfq_no: string) => {
    setIsDialogOpen(true);
    setSelectedQuotation(rfq_no);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full ">
      <p className="text-xl">{title}</p>
      <div className="grid grid-cols-3 gap-4 mt-8 relative">
        {filteredQuotations.length > 0 ? (
          filteredQuotations.map((quotation) => (
            <Card className="group">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl">{quotation.supplier_name}</p>
                    <p className="text-sm">
                      {formatDate(quotation.created_at)}
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      navigate(`/bac/quotation/${quotation.rfq_no}`)
                    }
                  >
                    <p className="px-2">View</p>

                    <OpenInNewWindowIcon
                      width={20}
                      height={20}
                      className="hover:cursor-pointer"
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  Supplier Address: {quotation.supplier_address}
                </p>
                <p className="text-base">TIN: {quotation.tin}</p>
                <p className="text-base">
                  {quotation.is_VAT ? "VAT" : "non-VAT"}
                </p>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between items-center">
                  {!item_loading ? (
                    getLowPriceSummary(_items, itemQuotations, quotation.rfq_no)
                  ) : (
                    <p className="text-orange-400">Processing...</p>
                  )}
                  {isDeleteAllowed && (
                    <div className="bg-red-200 rounded-full p-2 opacity-0 group-hover:opacity-100 ease-in-out cursor-pointer">
                      <TrashIcon
                        className=""
                        width={20}
                        height={20}
                        onClick={() => handleOpenDialog(quotation.rfq_no)}
                      />
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="grid place-items-center w-full h-96">
            <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
            <p>No Supplier </p>
          </div>
        )}
      </div>
      <DeleteDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        message="Request For Quotation"
        onDeleteClick={handleDeleteClick}
      />
    </div>
  );
};
