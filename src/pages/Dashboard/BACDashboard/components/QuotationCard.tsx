import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckIcon, Cross2Icon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import {
  useGetItemQuotation,
  useRequestForQoutation,
} from "@/services/requestForQoutationServices";
import { formatDate } from "@/services/formatDate";
import Loading from "../../shared/components/Loading";
import { useGetItemInPurchaseRequest } from "@/services/itemServices";
import { useParams } from "react-router-dom";
import { ItemType } from "@/types/request/item";
import { itemQuotationResponseType } from "@/types/response/request-for-qoutation";

const getLowPriceSummary = (
  items: ItemType[],
  itemQuotation: itemQuotationResponseType[],
  rfq_no: string
) => {
  const _items = items.length;
  const itemHasLowPrice = itemQuotation.filter(
    (data) => data.rfq === rfq_no && data.is_low_price === true
  ).length;

  if(items.length === 0) return <p className="text-sm text-orange-400">Processing...</p>
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

export const QuotationCard = () => {
  const { pr_no } = useParams();
  const { data: items, isLoading: item_loading } = useGetItemInPurchaseRequest(
    pr_no!
  );
  const { data } = useRequestForQoutation();
  const { data: item, isLoading } = useGetItemQuotation();
  const _items = Array.isArray(items?.data) ? items.data : [];
  const itemQuotations = Array.isArray(item?.data) ? item?.data : [];
  const quotations = Array.isArray(data?.data) ? data?.data : [];

  if (isLoading) return <Loading />;

  return (
    <div className=" w-full">
      <p className="text-xl">All Request For Quotation</p>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {quotations.length > 0 ? (
          quotations.map((quotation) => (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl">{quotation.supplier_name}</p>
                    <p className="text-sm">
                      {formatDate(quotation.created_at)}
                    </p>
                  </div>
                  <OpenInNewWindowIcon
                    width={20}
                    height={20}
                    className="hover:cursor-pointer"
                  />
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
                  {!item_loading ? getLowPriceSummary(_items, itemQuotations, quotation.rfq_no) : <p className="text-orange-400">Processing...</p>}
              </CardFooter>
            </Card>
          ))
        ) : (
          <Loading/>
        )}
      </div>
    </div>
  );
};
