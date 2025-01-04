import { useMemo, useState } from "react";
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
import Loading from "../../shared/components/Loading";
import { generateICSPDF } from "@/utils/generateICSPDF";
import { generateRISPDF } from "@/utils/generateRISPDF";
import { useGetItemsDelivered } from "@/services/puchaseOrderServices";
import { _itemsDeliveredType } from "@/types/request/purchase-order";

interface ItemDistributeDialogProps {
  pr_no: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ItemDistributeDialog({
  pr_no,
  isOpen,
  setIsOpen,
}: ItemDistributeDialogProps) {
  const [selectedItems, setSelectedItems] = useState<_itemsDeliveredType[]>([]);

  const { data: item_delivered, isLoading:isItemsDeliveredLoading } = useGetItemsDelivered();

  const itemsDeliveredData = useMemo(() => {
    return Array.isArray(item_delivered?.data) ? item_delivered.data : [];
  }, [item_delivered?.data]);

  const filteredItemsDeliveredData = useMemo(() => {
    return itemsDeliveredData.filter(
      (data) => data.inspection_details.po_details.pr_details.pr_no === pr_no
    );
  }, [itemsDeliveredData, pr_no]);

  console.log(itemsDeliveredData);

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

  const generateRIS = async () => {
    const url = await generateRISPDF(filteredItemsDeliveredData);
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Items</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isItemsDeliveredLoading ? (
            <Loading />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="w-[50px]">Select</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItemsDeliveredData.map((item) => (
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
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={generateICS} disabled={selectedItems.length === 0}>
            Generate ICS PDF
          </Button>
          <Button onClick={generateRIS} disabled={selectedItems.length === 0}>
            Generate RIS PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
