import api from "@/api";
import {
  abstractType,
  itemSelectedQuoteType,
} from "@/types/request/abstract_of_quotation";
import {
  abstractType_,
  itemSelectedType_,
} from "@/types/response/abstract-of-quotation";
import { ApiResponse } from "@/types/response/api-response";
import { handleError, handleSucess } from "@/utils/apiHelper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const getAllAbstractOfQuotation = async (): Promise<
  ApiResponse<abstractType_[]>
> => {
  try {
    const response = await api.get<abstractType_[]>(
      "api/abstract-of-quotation/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAbstractOfQuotation = () => {
  return useQuery<ApiResponse<abstractType_[]>, Error>({
    queryKey: ["abstract-of-quotations"],
    queryFn: getAllAbstractOfQuotation,
  });
};

export const getAbstractOfQuotation = async (afq_no:string):Promise<ApiResponse<abstractType_>> => {
  try {
    const response = await api.get<abstractType_>(`api/abstract-of-quotation/${afq_no}`)
    return handleSucess(response)
  } catch (error) {
    return handleError(error)
  }
}

export const useGetAbstractOfQuotation = (aoq_no: string) => {
  return useQuery<ApiResponse<abstractType_>, Error>({
    queryKey: ["abstract-of-quotations", aoq_no],
    queryFn: () => getAbstractOfQuotation(aoq_no)
  })
}


export const getAllItemSelectedQuote = async (): Promise<
  ApiResponse<itemSelectedType_[]>
> => {
  try {
    const response = await api.get<itemSelectedType_[]>(
      "api/item-selected-quote/"
    );
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAllItemSelectedQuote = () => {
  return useQuery<ApiResponse<itemSelectedType_[]>>({
    queryKey: ["item-selected-quotes"],
    queryFn: getAllItemSelectedQuote,
  });
};

export const FilteredItemSelectedInPR = (
  data: itemSelectedType_[],
  pr_no: string
) => {
  console.log(data);
  return data.filter((item) => item.pr_details.pr_no === pr_no);
};

export const totalItemSelectedInAOQ = (
  data: itemSelectedType_[],
  aoq_no: string
) => {
  return data.filter((item) => item.is_item_selected && item.afq === aoq_no)
    .length;
};

export const addAbstractOfQuotation = async (
  data: abstractType
): Promise<ApiResponse<abstractType>> => {
  try {
    const response = await api.post("/api/abstract-of-quotation/", data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddAbstractOfQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<abstractType>, Error, abstractType>({
    mutationFn: (data) => addAbstractOfQuotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abstract-of-quotations"] });
    },
  });
};

export const addItemSelectedQuote = async (
  data: itemSelectedQuoteType
): Promise<ApiResponse<itemSelectedQuoteType>> => {
  try {
    const response = await api.post("api/item-selected-quote/", data);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useAddItemSelectedQuote = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<itemSelectedQuoteType>,
    Error,
    itemSelectedQuoteType
  >({
    mutationFn: (data) => addItemSelectedQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-selected-quotes"] });
    },
  });
};

export const deleteAbstractOfQuoutation = async (
  aoq_no: string
): Promise<ApiResponse<abstractType>> => {
  try {
    const response = await api.delete(`api/abstract-of-quotation/${aoq_no}`);
    return handleSucess(response);
  } catch (error) {
    return handleError(error);
  }
};

export const useDeleteAbstractOfQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAbstractOfQuoutation,
    mutationKey: ["abstract-of-quotations"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abstract-of-quotations"] });
    },
  });
};

export const filterAOQInItemSelectedQuote = (
  data: abstractType,
  afq_no: string
) => {
  const items = Array.isArray(data) ? data : [];
  return items.filter((item) => item.afq === afq_no);
};

export const generateEmptyAOQPDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([936, 612]);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // text

  page.drawText("ABSTRACT OF QUOTATIONS hahahhaha", {
    x: 383,
    y: 496.06,
    size: 14,
    font: timesBoldFont,
  });

  page.drawText("Project Name:", {
    x: 194.49,
    y: 473.19,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Date of Posting:", {
    x: 186.61,
    y: 456.38,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Project Location:", {
    x: 182,
    y: 442.91,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Implementing Office:", {
    x: 162.5,
    y: 428,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Approved Budget:", {
    x: 176.7,
    y: 413,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("# of Sheets:", {
    x: 644.29,
    y: 473.19,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Award Resolution No.:", {
    x: 594,
    y: 456.38,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Date and Time:", {
    x: 627.7,
    y: 442.91,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Mode of Procurement:", {
    x: 597,
    y: 428,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("PR/Control No.:", {
    x: 624,
    y: 413,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText(
    "WE CERTIFY that we opened the bids of the above-listed materials, the abstract of which appears, as the time and date indicated.",
    { x: 56.69, y: 170.08, size: 11, font: timesRomanFont }
  );
  page.drawText("Bids and Awards Committee:", {
    x: 31.18,
    y: 153.07,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Conforme:", {
    x: 547.08,
    y: 153.07,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("No.", { x: 40, y: 375, size: 11, font: timesBoldFont });
  page.drawText("Items", { x: 200, y: 375, size: 11, font: timesBoldFont });
  page.drawText("Quantity", { x: 375, y: 375, size: 11, font: timesBoldFont });

  page.drawText("Agency", { x: 435.07, y: 383, size: 11, font: timesBoldFont });
  page.drawText("Price", { x: 440, y: 370, size: 11, font: timesBoldFont });

  page.drawText("WINNING BIDDER", {
    x: 578,
    y: 375,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("WINNING PRICE  ", {
    x: 795,
    y: 375,
    size: 11,
    font: timesBoldFont,
  });

  //text signature
  page.drawText("RYAN H. TEO, MPA", {
    x: 80.39,
    y: 129.92,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Member", {
    x: 96.92,
    y: 115.75,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("LEMUEL M. VELASCO, Dev.Ed.D", {
    x: 334.72,
    y: 129.92,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Member", {
    x: 381.93,
    y: 115.75,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("End-user", {
    x: 726.77,
    y: 115.75,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("JUNE REY A. VILLEGAS", {
    x: 68.57,
    y: 78,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Member", {
    x: 96.92,
    y: 62.87,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("CHARISSA JANE S. SAMBOLA, CPA", {
    x: 331.46,
    y: 79,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Vice-Chairman", {
    x: 371.14,
    y: 62.87,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("LEVI U. PANGAN, LPT", {
    x: 200,
    y: 110.75,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Chairman", {
    x: 225.14,
    y: 100,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("EINGILBERT C. BENOLIRAO, Dev.Ed.D.", {
    x: 658.44,
    y: 78,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Campus Director / Head of Procuring Entity", {
    x: 665,
    y: 62.87,
    size: 11,
    font: timesRomanFont,
  });

  //Horizontal Line
  page.drawLine({
    start: { x: 29.53, y: 401.57 },
    end: { x: 898.98, y: 401.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 354.33 },
    end: { x: 898.98, y: 354.33 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  //Horizontal Line on Table
  page.drawLine({
    start: { x: 29.53, y: 338.63 },
    end: { x: 898.98, y: 338.63 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 324.15 },
    end: { x: 898.98, y: 324.15 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 306.14 },
    end: { x: 898.98, y: 306.14 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 289.14 },
    end: { x: 898.98, y: 289.14 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 272.13 },
    end: { x: 898.98, y: 272.13 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 255.12 },
    end: { x: 898.98, y: 255.12 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 238.11 },
    end: { x: 898.98, y: 238.11 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 221.1 },
    end: { x: 898.98, y: 221.1 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 204.09 },
    end: { x: 898.98, y: 204.09 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 29.53, y: 187.09 },
    end: { x: 898.98, y: 187.09 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  //Vertical Line
  page.drawLine({
    start: { x: 29.53, y: 402.3 },
    end: { x: 29.53, y: 186.8 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 64.96, y: 402.3 },
    end: { x: 64.96, y: 186.8 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 366.14, y: 402.3 },
    end: { x: 366.14, y: 186.8 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 425.2, y: 402.3 },
    end: { x: 425.2, y: 186.8 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 480.31, y: 402.3 },
    end: { x: 480.31, y: 186.8 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 780.38, y: 402.3 },
    end: { x: 780.38, y: 186.8 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 898.5, y: 402.3 },
    end: { x: 898.5, y: 186.8 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfBlobUrl = URL.createObjectURL(blob);
  return pdfBlobUrl;
};
