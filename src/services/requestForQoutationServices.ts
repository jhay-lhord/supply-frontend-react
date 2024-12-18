import api from "@/api";
import {
  itemQuotationRequestType,
  qoutationType,
} from "@/types/request/request_for_qoutation";
import {
  itemQuotationResponseType,
  quotationResponseType,
} from "@/types/response/request-for-qoutation";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const getAllRequestForQoutation = async (): Promise<
  ApiResponse<quotationResponseType[]>
> => {
  try {
    const response = await api.get<quotationResponseType[]>(
      "/api/request-for-qoutation/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useRequestForQoutation = () => {
  return useQuery<ApiResponse<quotationResponseType[]>, Error>({
    queryFn: getAllRequestForQoutation,
    queryKey: ["request-for-qoutations"],
  });
};

export const useRequestForQuotationCount = () => {
  const { data, isLoading } = useRequestForQoutation()
  const requestForQuotationCount = data?.data?.length ?? 0
  return { requestForQuotationCount, isLoading}
}

export const getRequestForQuotation = async (
  rfq_no: string
): Promise<ApiResponse<quotationResponseType>> => {
  try {
    const response = await api.get<quotationResponseType>(
      `/api/request-for-qoutation/${rfq_no}`
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetRequestForQuotation = (rfq_no: string) => {
  return useQuery<ApiResponse<quotationResponseType>, Error>({
    queryKey: ["request-for-qoutations", rfq_no],
    queryFn: () => getRequestForQuotation(rfq_no),
    enabled: !!rfq_no,
  });
};

export const useGetPurchaseRequestRequestBySupplier = (
  supplier_name: string
) => {
  const { data } = useRequestForQoutation();
  const requestForQoutationWithPr = data?.data
    ?.map((data) => data)
    .filter((data) => data.supplier_name === supplier_name);

  return requestForQoutationWithPr;
};

export const addRequestForQoutation = async (
  data: qoutationType
): Promise<ApiResponse<qoutationType>> => {
  try {
    const response = await api.post<qoutationType>(
      "/api/request-for-qoutation/",
      data
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddRequestForQoutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<qoutationType>, Error, qoutationType>({
    mutationFn: (data) => addRequestForQoutation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-for-qoutations"] });
    },
  });
};

export const editRequestForQuotation = async (
  data: qoutationType
): Promise<ApiResponse<qoutationType>> => {
  try {
    const response = await api.put<qoutationType>(
      `/api/request-for-qoutation/${data.rfq_no}`,
      data
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useEditRequestForQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<qoutationType>, Error, qoutationType>({
    mutationFn: editRequestForQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-for-qoutations"] });
      toast.success("Successfully Edit", {
        description: "Edit Request for Quotation Successfully",
      });
    },
  });
};

export const deleteRequestForQuotation = async (
  rfq_no: string
): Promise<ApiResponse<qoutationType>> => {
  try {
    const response = await api.delete(`/api/request-for-qoutation/${rfq_no}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useDeleteRequestForQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRequestForQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["request-for-qoutations"] });
      toast.success("Success", {
        description: "Request For Qoutation successfully deleted",
      });
    },
  });
};

export const editItemQuotation = async (
  data: itemQuotationRequestType
): Promise<ApiResponse<itemQuotationRequestType>> => {
  try {
    const response = await api.put<itemQuotationRequestType>(
      `/api/item-quotation/${data.item_quotation_no}`,
      data
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useEditItemQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<itemQuotationRequestType>,
    Error,
    itemQuotationRequestType
  >({
    mutationFn: editItemQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items-quotation"] });
    },
  });
};

export const getItemQuotation = async (): Promise<
  ApiResponse<itemQuotationResponseType[]>
> => {
  try {
    const response = await api.get<itemQuotationResponseType[]>(
      "/api/item-quotation/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useGetItemQuotation = () => {
  return useQuery<ApiResponse<itemQuotationResponseType[]>, Error>({
    queryFn: getItemQuotation,
    queryKey: ["items-quotation"],
  });
};

export const addItemQuotation = async (
  data: itemQuotationRequestType
): Promise<ApiResponse<itemQuotationRequestType>> => {
  try {
    const response = await api.post<itemQuotationRequestType>(
      "/api/item-quotation/",
      data
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddItemQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<itemQuotationRequestType>,
    Error,
    itemQuotationRequestType
  >({
    mutationFn: (data) => addItemQuotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items-quotation"] });
    },
  });
};

export const useRequestForQoutationCount = (pr_no: string) => {
  const { data } = useRequestForQoutation();

  const rfqCount = data?.data
    ?.map((data) => data)
    .filter((data) => data.purchase_request === pr_no).length;

  return rfqCount;
};

export const generateRFQPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([615.12, 936]);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  // text upper

  page.drawText("REQUEST FOR QUOTATION", {
    x: 215,
    y: 793.7,
    size: 14,
    font: timesBoldFont,
  });
  page.drawText("Date:", {
    x: 357.49,
    y: 764.33,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("BAC Resolution No.:", {
    x: 357.49,
    y: 750.33,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Quotation No.:", {
    x: 357.49,
    y: 736.33,
    size: 11,
    font: timesRomanFont,
  });

  page.drawLine({
    start: { x: 30.52, y: 720.87 },
    end: { x: 287, y: 720.87 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Company Name", {
    x: 32.5,
    y: 709.02,
    size: 11,
    font: timesRomanFont,
  });

  page.drawLine({
    start: { x: 30.52, y: 691.27 },
    end: { x: 287, y: 691.27 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Address", { x: 32.5, y: 678, size: 11, font: timesRomanFont });
  page.drawText("TIN:", { x: 32.5, y: 664, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 67, y: 663.29 },
    end: { x: 211.81, y: 663.29 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawText("Sir/Madam:", {
    x: 32.5,
    y: 635,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Please quote your ", {
    x: 50,
    y: 620,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("lowest price, taxes included, on the item/s listed below ", {
    x: 132,
    y: 620,
    size: 11,
    font: timesRomanItalicFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawText(", starting the shortest time of delivery and submit ", {
    x: 372,
    y: 620,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(
    "your quotation duly signed by you or your authorized representative. Insert your duly accomplished quotation on the attached ",
    { x: 35, y: 608, size: 11, font: timesRomanFont }
  );
  page.drawText("return envelope and seal the same.", {
    x: 35,
    y: 596,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(
    "We reserve the right to reject any and/or all bids/quotations submitted.",
    { x: 50, y: 584, size: 11, font: timesRomanFont }
  );

  page.drawText("LEVI U. PANGAN, LPT", {
    x: 420,
    y: 574,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Chairperson", {
    x: 437,
    y: 560,
    size: 11,
    font: timesRomanFont,
  });

  //Text inside table
  page.drawText("Item", { x: 34, y: 544, size: 11, font: timesBoldFont });
  page.drawText("No.", { x: 37, y: 531, size: 11, font: timesBoldFont });
  page.drawText("Item and Description", {
    x: 127,
    y: 538,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Qty / Unit", {
    x: 308,
    y: 538,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("ABC", {
    x: 382,
    y: 545,
    size: 10,
    font: timesBoldFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawText("(per unit)", {
    x: 373,
    y: 535,
    size: 10,
    font: timesBoldFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawText("Offered by Supplier", {
    x: 465,
    y: 545,
    size: 10,
    font: timesRomanItalicFont,
  });
  page.drawText("Brand/Model", {
    x: 445,
    y: 530,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText("Unit Price", {
    x: 530,
    y: 530,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText("PURPOSE:", {
    x: 34,
    y: 516,
    size: 10,
    font: timesBoldFont,
    color: rgb(1, 0, 0),
  });

  //text lower
  page.drawText("Delivery Period:", {
    x: 55,
    y: 291,
    size: 11,
    font: timesRomanFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawLine({
    start: { x: 130, y: 291 },
    end: { x: 250, y: 291 },
    thickness: 1,
    color: rgb(0, 0, 0.9),
  });

  page.drawText("Warranty:", {
    x: 55,
    y: 278,
    size: 11,
    font: timesRomanFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawLine({
    start: { x: 103, y: 277 },
    end: { x: 250, y: 277 },
    thickness: 1,
    color: rgb(0, 0, 0.9),
  });

  page.drawText("Price validity is 120 days from date of quotation.", {
    x: 55,
    y: 264,
    size: 11,
    font: timesRomanFont,
    color: rgb(0, 0, 0.9),
  });

  page.drawText(
    "Please be advised that in the event that you will be declared as the Lowest Complying and Responsive Supplier, said items",
    { x: 50, y: 238, size: 11, font: timesRomanFont }
  );
  page.drawText(
    "will be awarded to you subject to submission of the documentary requirements: ",
    { x: 35, y: 225, size: 11, font: timesRomanFont }
  );
  page.drawText("(1)  PHILGEPS   Registration  Certificate;  2.", {
    x: 390,
    y: 225,
    size: 11,
    font: timesRomanFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawText(
    "Mayor's  Permit;  3.  Income  Tax   Return,  &  4.  Omnibus Sworn Statement. A Notice of Award and Purchase Order will be",
    { x: 35, y: 212, size: 11, font: timesRomanFont, color: rgb(0, 0, 0.9) }
  );
  page.drawText("issued.", {
    x: 35,
    y: 199,
    size: 11,
    font: timesRomanFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawText("Note: Award to the Lowest Complying Supplier shall be on ", {
    x: 50,
    y: 186,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("ITEM BASIS.", {
    x: 315,
    y: 186,
    size: 11,
    font: timesRomanFont,
    color: rgb(0, 0, 0.9),
  });
  page.drawText(
    "After having carefully read and accepted your General Conditions, I/We quote on the item at prices noted above:",
    { x: 50, y: 160, size: 11, font: timesRomanFont }
  );

  page.drawText("Canvassed by:", {
    x: 35,
    y: 108,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 60, y: 82 },
    end: { x: 260, y: 82 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Signature over Printed Name of Canvasser", {
    x: 66,
    y: 69,
    size: 11,
    font: timesRomanFont,
  });

  page.drawLine({
    start: { x: 330, y: 129 },
    end: { x: 584.5, y: 129 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Signature over Printed Name of Supplier", {
    x: 350,
    y: 119,
    size: 11,
    font: timesRomanFont,
  });

  page.drawLine({
    start: { x: 330, y: 94 },
    end: { x: 584.5, y: 94 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Tel. No. / Cellphone No. & Email Address", {
    x: 350,
    y: 84,
    size: 11,
    font: timesRomanFont,
  });

  page.drawLine({
    start: { x: 330, y: 59 },
    end: { x: 584.5, y: 59 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Date", { x: 440, y: 49, size: 11, font: timesRomanFont });

  //Horizontal Line

  page.drawLine({
    start: { x: 30.52, y: 555 },
    end: { x: 585, y: 555 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 430, y: 541 },
    end: { x: 585, y: 541 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 527 },
    end: { x: 585, y: 527 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 513 },
    end: { x: 585, y: 513 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 30.52, y: 499 },
    end: { x: 585, y: 499 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 485 },
    end: { x: 585, y: 485 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 471 },
    end: { x: 585, y: 471 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 457 },
    end: { x: 585, y: 457 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 443 },
    end: { x: 585, y: 443 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 429 },
    end: { x: 585, y: 429 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 415 },
    end: { x: 585, y: 415 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 401 },
    end: { x: 585, y: 401 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 387 },
    end: { x: 585, y: 387 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 373 },
    end: { x: 585, y: 373 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 359 },
    end: { x: 585, y: 359 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 345 },
    end: { x: 585, y: 345 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 331 },
    end: { x: 585, y: 331 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 317 },
    end: { x: 585, y: 317 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 303 },
    end: { x: 585, y: 303 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  //Vertical Line
  page.drawLine({
    start: { x: 30.52, y: 555.5 },
    end: { x: 30.52, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 60, y: 555.5 },
    end: { x: 60, y: 527.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 60, y: 513.5 },
    end: { x: 60, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 301, y: 555.5 },
    end: { x: 301, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 327, y: 527.5 },
    end: { x: 327, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 360, y: 555.5 },
    end: { x: 360, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 430, y: 555.5 },
    end: { x: 430, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 520, y: 541.5 },
    end: { x: 520, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 584.5, y: 555.5 },
    end: { x: 584.5, y: 302.5 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfBlobUrl = URL.createObjectURL(blob);
  return pdfBlobUrl;
};
