import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { generateICSPDF } from "@/utils/generateICSPDF";
import { _itemsDeliveredType } from "@/types/request/purchase-order";

interface ItemDistributeDialogProps {
  itemsDeliveredData: _itemsDeliveredType[]
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function GenerateICSPDFDialog({
  itemsDeliveredData,
  isOpen,
  setIsOpen,
}: ItemDistributeDialogProps) {
  const [selectedItems, setSelectedItems] = useState<_itemsDeliveredType[]>([]);


  const handleItemToggle = (data: _itemsDeliveredType) => {
    setSelectedItems((prev) =>
      prev.includes(data)
        ? prev.filter((id) => id.id !== data.id)
        : [...prev, data]
    );
  };

  const generateICS = async () => {
    const url = await generateICSPDF(selectedItems);
    window.open(url, "_blank");
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Items</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
        <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="w-[50px]">Select</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsDeliveredData && itemsDeliveredData.length > 0 && itemsDeliveredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {
                        item.item_details.item_quotation_details.item_details
                          .item_description
                      }
                    </TableCell>
                    <TableCell>
                      {
                        item.item_details.item_quotation_details.item_details
                          .quantity
                      }
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item)}
                        onCheckedChange={() => handleItemToggle(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={generateICS} disabled={selectedItems.length === 0}>
            Generate ICS PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
