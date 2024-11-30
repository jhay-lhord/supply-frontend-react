import {
  totalItemSelectedInAOQ,
  useAbstractOfQuotation,
  useAllItemSelectedQuote,
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
} from "@/components/ui/card";
import { formatDate } from "@/services/formatDate";
import { Empty } from "../shared/components/Empty";
import { useNavigate } from "react-router-dom";
import { Button } from "react-day-picker";
import Layout from "./components/Layout/BACDashboardLayout";


export const AllAbstract = () => {
  const { data } = useAllItemSelectedQuote();
  const { data: aoq_data } = useAbstractOfQuotation();
  const navigate = useNavigate();

  const records = Array.from({ length: 150 }, (_, i) => ({
    id: 'id' + (i + 1),
    text: `Item ${i + 1}`,
  }));

const fields = { text: 'text', value: 'id' };

  const abstract = Array.isArray(aoq_data?.data) ? aoq_data.data : [];

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

  return (
    <Layout>
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
                        <p className="text-sm text-gray-500">{data.afq_no}</p>
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          ``
                          <TooltipTrigger asChild>
                            <Button
                              className="bg-orange-200 p-2"
                              onClick={() =>
                                navigate(
                                  `/bac/abstract-item-list/${data.afq_no}`
                                )
                              }
                            >
                              <p>View</p>
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
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Empty message="No Abstract of Quotation found" />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
