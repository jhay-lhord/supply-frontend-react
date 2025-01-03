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

interface Item {
  id: number;
  name: string;
  quantity: number;
}

const items: Item[] = [
  { id: 1, name: "Laptop", quantity: 10 },
  { id: 2, name: "Mouse", quantity: 20 },
  { id: 3, name: "Keyboard", quantity: 15 },
  { id: 4, name: "Monitor", quantity: 8 },
  { id: 5, name: "Headphones", quantity: 12 },
];

interface ItemDistributeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ItemDistributeDialog({
  isOpen,
  setIsOpen,
}: ItemDistributeDialogProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleItemToggle = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const generateICS = () => {
    console.log("Generating ICS PDF for items:", selectedItems);
    // Implement PDF generation logic here
  };

  const generateRIS = () => {
    console.log("Generating RIS PDF for items:", selectedItems);
    // Implement PDF generation logic here
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
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
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
          <Button onClick={generateRIS} disabled={selectedItems.length === 0}>
            Generate RIS PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
