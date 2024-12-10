import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { OpenInNewWindowIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  useDeleteRequestForQuotation,
  useRequestForQoutation,
} from "@/services/requestForQoutationServices";
import { formatDate } from "@/services/formatDate";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "./components/Layout/BACDashboardLayout";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DeleteDialog } from "../shared/components/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BuildingIcon, CalendarIcon, CreditCardIcon, MapPinIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface QuotationCardProps {
  title: string;
}
interface EmptyProps {
  query: string;
}

const Empty: React.FC<EmptyProps> = ({ query }) => (
  <div>
    <div className="grid place-items-center w-full h-96">
      <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
      <p>{`No Request of Quotation Found ${query}`}</p>
    </div>
  </div>
);

type DropdownOption = "purchase_request" | "supplier_name" | "supplier_address";

export const AllQuotations: React.FC<QuotationCardProps> = ({ title }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [rfqNo, setRFQNo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDropdown, setSelectedDropdown] =
    useState<DropdownOption>("purchase_request");

  const { data } = useRequestForQoutation();
  const { mutate, isSuccess } = useDeleteRequestForQuotation();

  const quotations = Array.isArray(data?.data) ? data?.data : [];

  const filteredQuotation = quotations.filter((quotation) =>
    quotation[selectedDropdown].toString().includes(searchQuery)
  );

  const handleDialogOpen = (rfq_no: string) => {
    setIsDialogOpen(true);
    setRFQNo(rfq_no);
  };

  const handleDelete = () => {
    mutate(rfqNo!);
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Request of Quotation Successfully deleted",
      });
    }
  };

  return (
    <Layout>
      <div className="w-full ">
        <div className="flex justify-between ">
          <p className="text-xl">{title}</p>
          <div className="flex">
            <Select
              onValueChange={(value: DropdownOption) =>
                setSelectedDropdown(value)
              }
            >
              <SelectTrigger className="w-[180px] bg-orange-200 active:focus-none">
                <SelectValue placeholder="Search By..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="purchase_request">
                    Purchase Request
                  </SelectItem>
                  <SelectItem value="supplier_name">Supplier Name</SelectItem>
                  <SelectItem value="supplier_address">
                    Supplier Address
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
                      <div className="flex gap-2 items-center">
                        <BuildingIcon className="h-5 w-5" />
                        <p className="text-xl">{quotation.supplier_name}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <CalendarIcon className="h-4 w-4" />
                        <p className="text-sm">
                          {formatDate(quotation.created_at)}
                        </p>
                      </div>
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
                  <Separator/>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 items-center">
                    <MapPinIcon className="h-4 w-4" />
                    <p className="text-base">{quotation.supplier_address}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <CreditCardIcon className="w-4 h-4"/>
                  <p className="text-base">{quotation.tin}</p>
                  </div>
                  <Badge variant={"outline"}>
                    {quotation.is_VAT ? "VAT" : "non-VAT"}
                  </Badge>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between  w-full">
                    <p className="flex items-center rounded-full bg-green-200 px-2 py-0 text-xs">
                      {quotation.purchase_request}
                    </p>

                    <div className="bg-red-200 rounded-full p-2 opacity-0 group-hover:opacity-100 ease-in-out cursor-pointer">
                      <TrashIcon
                        className=""
                        width={20}
                        height={20}
                        onClick={() => handleDialogOpen(quotation.rfq_no)}
                      />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
        <DeleteDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          message="Request for Quotation"
          onDeleteClick={handleDelete}
        />
        {filteredQuotation.length === 0 && <Empty query={searchQuery} />}
      </div>
    </Layout>
  );
};
