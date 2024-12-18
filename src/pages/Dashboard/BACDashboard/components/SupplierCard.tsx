import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { qoutationType } from "@/types/request/request_for_qoutation";
import { BuildingIcon, CreditCardIcon, MapPinIcon } from "lucide-react";

interface SupplierCardProps {
  supplier: qoutationType;
  isSelected: boolean;
  onToggle: () => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  isSelected,
  onToggle,
}) => {
  return (
    <Card
      key={supplier.rfq_no}
      onClick={onToggle}
      className={` border-2 rounded-lg p-0 ${
        isSelected ? "border-orange-300" : "border-gray-300"
      }`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <BuildingIcon className="h-4 w-4" />
          <p className=" font-thin">{supplier.supplier_name}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-3 w-3" />
          <p className="text-sm font-thin">{supplier.supplier_address}</p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-3 w-3" />
          <p className="text-sm font-thin">{supplier.tin}</p>
        </div>
        <div>
          <Badge variant={"outline"}>
            <p className="text-xs font-thin">{supplier.is_VAT ? "VAT" : "non-VAT"}</p>
          </Badge>
        </div>
      </CardContent>
    </Card> 
  );
};
