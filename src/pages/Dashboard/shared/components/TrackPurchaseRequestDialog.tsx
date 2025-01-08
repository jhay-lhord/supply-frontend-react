import { useState } from "react";
import { Loader2, Search, PackageSearch, FileSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAllStatusInPurchaseRequest } from "@/services/trackPurchaseRequest";
import { formatDate } from "@/services/formatDate";

interface TrackPurchaseRequestDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function TrackPurchaseRequestDialog({
  isOpen,
  setIsOpen,
}: TrackPurchaseRequestDialogProps) {
  const [prNo, setPrNo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isFetching } = useGetAllStatusInPurchaseRequest({
    pr_no: searchTerm,
  });

  const purchaseRequestStatus = isOpen
    ? Array.isArray(data?.data)
      ? data.data
      : []
    : [];

  const handleSearch = () => {
    if (prNo) {
      console.log("trigger");
      setSearchTerm(prNo);
    }
  };

  console.log("Current purchaseRequestStatus:", purchaseRequestStatus);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[50rem]">
        <DialogHeader>
          <DialogTitle>Track and Trace</DialogTitle>
          <DialogDescription>
            Enter your Purchase Request number to get status updates
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <form className="flex gap-2 mb-4">
            <Input
              type="search"
              placeholder="Enter tracking number"
              value={prNo}
              onChange={(e) => setPrNo(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={handleSearch} disabled={isFetching}>
              {isFetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  Search
                  <Search className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          {purchaseRequestStatus.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">
                    Purchase Request Number
                  </h2>
                  <p className="text-gray-600">
                    {purchaseRequestStatus[0].pr_no}
                  </p>
                </div>

                <div className="relative max-h-[300px] overflow-y-auto pr-2">
                  <div className="absolute left-[5px] top-2 w-0.5 h-[calc(100%-16px)] bg-gray-200" />
                  <ScrollArea className="h-[15rem]">
                    {purchaseRequestStatus.map((update, index) => (
                      <div key={index} className="mb-6 relative pl-6">
                        <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-[#fed7aa] z-10" />
                        <div>
                          <h3 className="font-semibold">{update.status}</h3>
                          <p className="text-sm text-gray-500 mb-1">
                            {formatDate(update.updated_at)}
                          </p>
                          <p className="text-gray-600">{update.description}</p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          ) : searchTerm !== "" && !isFetching ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <PackageSearch className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Purchase Request Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any purchase request matching "{searchTerm}
                    ". Please check the purchase request number and try again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPrNo("");
                      setSearchTerm("");
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <FileSearch className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Track Your Purchase Request
              </h3>
              <p className="text-gray-600 mb-4">
                Enter your Purchase Request number in the search box above to
                track its status. You'll be able to see all updates and current
                status of your request.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-4">
                <li className="mb-2">✓ Real-time status updates</li>
                <li className="mb-2">✓ Complete request history</li>
                <li>✓ Detailed information at each stage</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
