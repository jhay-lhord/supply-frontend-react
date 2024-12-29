import { Building2, CreditCard, MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supplierType_ } from "@/types/response/abstract-of-quotation";
import { Badge } from "@/components/ui/badge";

interface SupplierInfoProps {
  supplier: supplierType_;
}

export default function SupplierInformation({ supplier }: SupplierInfoProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 py-2 bg-orange-50 p-2 hover:text-accent-foreground rounded-md transition-colors cursor-pointer">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm">{supplier.rfq_details.supplier_name}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="w-80">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {supplier.rfq_details.supplier_name}
            </h3>
            <div className="text-sm">
              <div className="flex gap-2 my-2">
                <MapPin size={18} />
                <p>{supplier.rfq_details.supplier_address}</p>
              </div>
              <div className="flex gap-2">
                <CreditCard size={18} />
                <p>{supplier.rfq_details.tin}</p>
              </div>
              <div className="my-2">
                <Badge>{supplier.rfq_details.is_VAT ? "VAT" : "non-VAT"}</Badge>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
