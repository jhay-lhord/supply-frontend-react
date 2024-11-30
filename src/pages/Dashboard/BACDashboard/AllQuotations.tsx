import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronDownIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { useRequestForQoutation } from "@/services/requestForQoutationServices";
import { formatDate } from "@/services/formatDate";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "./components/Layout/BACDashboardLayout";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Loading from "../shared/components/Loading";

interface QuotationCardProps {
  title: string;
}
interface EmptyProps {
  query: string;
}

const Empty:React.FC<EmptyProps> = ({query}) => (
  <div>
    <div className="grid place-items-center w-full h-96">
      <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
      <p>{`No Request of Quotation Found of query ${query}`}</p>
    </div>
  </div>
);

type DropdownOption = "purchase_request" | "supplier_name" | "supplier_address";

export const AllQuotations: React.FC<QuotationCardProps> = ({ title }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDropdown, setSelectedDropdown] = useState<DropdownOption>("purchase_request")

  const { data } = useRequestForQoutation();

  const quotations = Array.isArray(data?.data) ? data?.data : [];

  const filteredQuotation = quotations.filter((quotation) =>
    quotation[selectedDropdown].toString().includes(searchQuery)
  );
  console.log(selectedDropdown)

  return (
    <Layout>
      <div className="w-full ">
        <div className="flex justify-between ">
          <p className="text-xl">{title}</p>
          <div className="flex"> 
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-1 items-center bg-orange-200 rounded-l-md p-2">Search By <ChevronDownIcon/></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setSelectedDropdown("purchase_request")}>Purchase Request</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedDropdown("supplier_name")}>Supplier Name</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedDropdown("supplier_address")}>Supplier Address</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="search"
              className="w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for ${selectedDropdown.replace("_", " ")}`}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 relative">
          {filteredQuotation.length > 0 &&
            filteredQuotation.map((quotation, index) => (
              <Card key={index} className="group">
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
                  <p className="rounded-full bg-green-200 px-2 py-1 text-xs">
                    {quotation.purchase_request}
                  </p>
                </CardFooter>
              </Card>
            ))}
        </div>
        {filteredQuotation.length === 0 && <Empty query={searchQuery}/>}
      </div>
    </Layout>
  );
};
