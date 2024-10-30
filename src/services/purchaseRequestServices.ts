import api from "@/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/response/api-response";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation } from "@tanstack/react-query";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toast } from "sonner";
import { ItemType } from "@/types/request/item";

export const GetPurchaseRequest = async (): Promise<
  ApiResponse<purchaseRequestType[]>
> => {
  try {
    const response = await api.get<purchaseRequestType[]>(
      "/api/purchase-request/"
    )
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const GetPurchaseRequestList = async (
  pr_no: string
): Promise<ApiResponse<purchaseRequestType>> => {
  try {
    const response = await api.get<purchaseRequestType>(
      `api/purchase-request/${pr_no}`
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const AddPurchaseRequest = async (data: {
  pr_no: string;
  res_center_code: string;
  purpose: string;
  pr_status: string;
  requested_by: string;
  approved_by: string;
}) => {
  try {
    const response = await api.post("api/purchase-request/", data);
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const UpdatePurchaseRequest = async (data: purchaseRequestType) => {
  try {
    const response = await api.put(`api/purchase-request/${data.pr_no}`, data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useUpdatePurchaseRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<purchaseRequestType>,
    Error,
    purchaseRequestType
  >({
    mutationFn: UpdatePurchaseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_request"] });
      toast.success("Edit Successfully", {
        description: "Item Purchase Request Successfully",
      });
    },
  });
};

export const usePurchaseRequest = () => {
  return useQuery<ApiResponse<purchaseRequestType[]>, Error>({
    queryKey: ["purchase-request"],
    queryFn: GetPurchaseRequest,
    refetchInterval: 5000,
  });
};

export const usePurchaseRequestCount = () => {
  const { data, isLoading } = usePurchaseRequest();
  const purchaseRequestCount = data?.data?.length;
  return { purchaseRequestCount, isLoading };
};

export const usePurchaseRequestInProgressCount = () => {
  const { data, isLoading } = usePurchaseRequest();
  const purchase_request_in_progress = data?.data
    ?.map((data) => {
      return data;
    })
    .filter((data) => {
      return data.status === "Ready for Canvassing";
    });
  const inProgressCount = purchase_request_in_progress?.length;
  return { inProgressCount, isLoading };
};

export const usePurchaseRequestInProgress = () => {
  const { data, isLoading } = usePurchaseRequest();

  const purchaseRequestInProgress = data?.data
    ?.map((data) => {
      return data;
    })
    .filter((data) => {
      return data.status === "Ready for Canvassing";
    });

  return { purchaseRequestInProgress, isLoading };
};
export const usePurchaseRequestList = (pr_no: string) => {
  return useQuery<ApiResponse<purchaseRequestType>, Error>({
    queryKey: ["purchase_request", pr_no],
    queryFn: () => GetPurchaseRequestList(pr_no!),
    enabled: !!pr_no,
  });
};
export const GetPurchaseRequestItem = async (): Promise<
  ApiResponse<purchaseRequestType[]>
> => {
  try {
    const response = await api.get<purchaseRequestType[]>(
      "/api/purchase-request-item/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deletePurchaseRequest = async (pr_no: string): Promise<T> => {
  try {
    const response = await api.delete(`/api/purchase-request/${pr_no}`);
    console.log(response);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const generateEditablePDF = async () => {
  console.log("clicked");
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // 8.5 inches x 11 inches in points

  // Embed the standard Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Add title and other elements to the PDF
  page.drawText("PURCHASE REQUEST", {
    x: 201,
    y: 725,
    size: 14,
    font: timesBoldFont,
  });
  page.drawText("Appendix 60", {
    x: 490,
    y: 760,
    size: 14,
    font: timesRomanItalicFont,
  });
  page.drawText("Entity Name:", {
    x: 23,
    y: 697,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("CTU - ARGAO CAMPUS", {
    x: 96,
    y: 697,
    size: 11,
    font: timesRomanFont,
  });

  // Horizontal and vertical lines are drawn here...
  //Horizontal Line

  page.drawLine({
    start: { x: 22, y: 680 },
    end: { x: 564, y: 680 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 635 },
    end: { x: 564, y: 635 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 590 },
    end: { x: 564, y: 590 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 43 },
    end: { x: 564, y: 43 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 102 },
    end: { x: 564, y: 102 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 150 },
    end: { x: 564, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Add Fund Cluster label and editable field
  page.drawText("Fund Cluster:", {
    x: 369,
    y: 697,
    size: 11,
    font: timesBoldFont,
  });

  page.drawText("", { x: 130, y: 669, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 445, y: 695 }, // Starting point of the line
    end: { x: 520, y: 695 }, // Ending point of the line (same y value)
    thickness: 1, // Line thickness
    color: rgb(0, 0, 0), // Black color
  });
  page.drawText("Office/Section:", {
    x: 30,
    y: 663,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("PR No.:", { x: 125, y: 663, size: 11, font: timesBoldFont });
  page.drawText("Responsibility Center Code :", {
    x: 125,
    y: 645,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Date :", { x: 418, y: 663, size: 11, font: timesBoldFont });
  page.drawText("Stock/", { x: 30, y: 620, size: 11, font: timesBoldFont });
  page.drawText("Property", { x: 25, y: 609, size: 11, font: timesBoldFont });
  page.drawText("No.", { x: 35, y: 595, size: 11, font: timesBoldFont });
  page.drawText("Unit", { x: 80, y: 610, size: 11, font: timesBoldFont });
  page.drawText("Item Description", {
    x: 206,
    y: 610,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Quantity", {
    x: 370,
    y: 610,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Unit Cost", {
    x: 425,
    y: 610,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Total Cost", {
    x: 495,
    y: 610,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Purpose:", { x: 53, y: 138, size: 12, font: timesBoldFont });
  page.drawText("Requested by:", {
    x: 125,
    y: 92,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText("Signature:", {
    x: 26,
    y: 80,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText("Printed Name:", {
    x: 26,
    y: 65,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText("Designation:", {
    x: 26,
    y: 50,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText("Approved by:", {
    x: 367,
    y: 92,
    size: 12,
    font: timesBoldFont,
  });
  //Vertical Lines
  page.drawLine({
    start: { x: 22.68, y: 680 },
    end: { x: 22.68, y: 43 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 564, y: 680 },
    end: { x: 564, y: 43 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 416, y: 680 },
    end: { x: 416, y: 150 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 119, y: 680 },
    end: { x: 119, y: 150 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 635 },
    end: { x: 65, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 480, y: 635 },
    end: { x: 480, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 365, y: 635 },
    end: { x: 365, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 365, y: 102 },
    end: { x: 365, y: 43 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfBlobUrl = URL.createObjectURL(blob);

  // Set the PDF URL to preview it
  return pdfBlobUrl;
};

export const generatePDF = async (
  items: ItemType[],
  purchase_request: purchaseRequestType
) => {
  console.log(items);
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error("No data available to generate the PDF");
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // 8.5 inches x 11 inches in points

  // Embed the standard Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Add title and other elements to the PDF
  page.drawText("PURCHASE REQUEST", {
    x: 201,
    y: 725,
    size: 14,
    font: timesBoldFont,
  });
  page.drawText("Appendix 60", {
    x: 510,
    y: 760,
    size: 10,
    font: timesRomanItalicFont,
  });
  page.drawText("Entity Name:", {
    x: 23,
    y: 697,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("CTU - ARGAO CAMPUS", {
    x: 96,
    y: 697,
    size: 11,
    font: timesRomanFont,
  });

  // Horizontal and vertical lines are drawn here...
  //Horizontal Line

  page.drawLine({
    start: { x: 22, y: 680 },
    end: { x: 564, y: 680 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 635 },
    end: { x: 564, y: 635 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 590 },
    end: { x: 564, y: 590 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 43 },
    end: { x: 564, y: 43 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 102 },
    end: { x: 564, y: 102 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 22.68, y: 150 },
    end: { x: 564, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Add Fund Cluster label and editable field
  page.drawText("Fund Cluster:", {
    x: 369,
    y: 697,
    size: 11,
    font: timesBoldFont,
  });

  page.drawText("", { x: 130, y: 669, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 445, y: 695 }, // Starting point of the line
    end: { x: 520, y: 695 }, // Ending point of the line (same y value)
    thickness: 1, // Line thickness
    color: rgb(0, 0, 0), // Black color
  });
  page.drawText("Office/Section:", {
    x: 30,
    y: 663,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("PR No.:", { x: 125, y: 663, size: 11, font: timesBoldFont });
  page.drawText("Responsibility Center Code :", {
    x: 125,
    y: 645,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Date :", { x: 418, y: 663, size: 11, font: timesBoldFont });
  page.drawText("Stock/", { x: 30, y: 620, size: 11, font: timesBoldFont });
  page.drawText("Property", { x: 25, y: 609, size: 11, font: timesBoldFont });
  page.drawText("No.", { x: 35, y: 595, size: 11, font: timesBoldFont });
  page.drawText("Unit", { x: 80, y: 610, size: 11, font: timesBoldFont });
  page.drawText("Item Description", {
    x: 206,
    y: 610,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Quantity", { x: 370, y: 610, size: 11, font: timesBoldFont });
  page.drawText("Unit Cost", { x: 425, y: 610, size: 11, font: timesBoldFont });
  page.drawText("Total Cost", {
    x: 495,
    y: 610,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Purpose:", { x: 53, y: 138, size: 12, font: timesBoldFont });
  page.drawText("Requested by:", {
    x: 125,
    y: 92,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText("Signature:", { x: 26, y: 80, size: 12, font: timesBoldFont });
  page.drawText("Printed Name:", {
    x: 26,
    y: 65,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText("Designation:", {
    x: 26,
    y: 50,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText("Approved by:", {
    x: 367,
    y: 92,
    size: 12,
    font: timesBoldFont,
  });
  //Vertical Lines
  page.drawLine({
    start: { x: 22.68, y: 680 },
    end: { x: 22.68, y: 43 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 564, y: 680 },
    end: { x: 564, y: 43 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 416, y: 680 },
    end: { x: 416, y: 150 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 119, y: 680 },
    end: { x: 119, y: 150 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 635 },
    end: { x: 65, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 480, y: 635 },
    end: { x: 480, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 365, y: 635 },
    end: { x: 365, y: 150 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 365, y: 102 },
    end: { x: 365, y: 43 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  // Add all the items from purchase request
  items.forEach((entry, index) => {
    const {
      stock_property_no,
      unit,
      item_description,
      quantity,
      unit_cost,
      total_cost,
    } = entry;

    const yPosition = 570 - index * 20; // Adjust y-coordinate for each entry

    page.drawText(stock_property_no, {
      x: 35,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });
    page.drawText(unit, {
      x: 80,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });
    page.drawText(item_description, {
      x: 130,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });
    page.drawText(quantity.toString(), {
      x: 385,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });
    page.drawText(unit_cost.toString(), {
      x: 438,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });
    page.drawText(total_cost.toString(), {
      x: 495,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });
  });

  //Add the Purchase Request Information
  const formattedDate = new Date(
    purchase_request.created_at
  ).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  page.drawText(purchase_request.pr_no, {
    x: 170,
    y: 663,
    size: 11,
    font: timesBoldFont,
    color: rgb(0, 0.8, 0),
  });
  page.drawText("_______________________", {
    x: 170,
    y: 663,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText(purchase_request.res_center_code, {
    x: 265,
    y: 645,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("_________________", {
    x: 265,
    y: 645,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText(formattedDate, {
    x: 450,
    y: 663,
    size: 11,
    font: timesBoldFont,
    color: rgb(0.8, 0, 0),
  });
  page.drawText("___________________", {
    x: 450,
    y: 663,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText(purchase_request.purpose, {
    x: 100,
    y: 125,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText(purchase_request.requested_by!, {
    x: 200,
    y: 70,
    size: 12,
    font: timesBoldFont,
  });
  page.drawText(purchase_request.approved_by!, {
    x: 443,
    y: 70,
    size: 12,
    font: timesBoldFont,
  });

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  return url; // Return the URL for preview/download
};
