import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { qoutationType } from "@/types/request/request_for_qoutation";

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
      className={` border-2 rounded-lg ${
        isSelected ? "border-orange-300" : "border-gray-300"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <p className="text-xl">{supplier.supplier_name}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base">{supplier.supplier_address}</p>
        <p className="text-base">{supplier.tin}</p>
        <p className="text-base">{supplier.is_VAT ? "VAT" : "non-VAT"}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
