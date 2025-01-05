/* eslint-disable @typescript-eslint/no-unused-vars */

import { itemType } from "@/types/response/item";
import { purchaseRequestType } from "@/types/response/puchase-request";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { formatPrDate } from "./formatDate";

export const generatePRPDF = async (
  item: itemType[]
) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const Helveticafont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const Helveticabold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const maxWidth = 240;
  const lineHeight = 12;
  const footerHeight = 239;
  const pageHeight = 792;
  let yPosition = 574;

  let runningTotal = 0;
  const wrapText = (text: string, maxWidth: number, fontSize: number) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const testWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine); // Push the last line
    return lines;
  };
  const pages = [];
  let pageIndex = 0;
  let page = pdfDoc.addPage([612, pageHeight]);
  const purposewidth = 580;
  pages.push(page);
  item.forEach((entry) => {
    const { stock_property_no, unit, item_description, quantity, unit_cost } =
      entry;

    const wrappedDescription = wrapText(item_description, maxWidth, 9);
    const descriptionHeight = wrappedDescription.length * lineHeight;
    const purposesplit = wrapText(item[0].pr_details.purpose, purposewidth, 12);

    purposesplit.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: 123,
        y: 132 - lineIndex * lineHeight,
        size: 9,
        font: timesRomanFont,
      });
    });
    const requestby1 = (item[0].pr_details.requisitioner_details.name ?? "").toUpperCase();
    const requestbywidth = Helveticabold.widthOfTextAtSize(requestby1, 10);
    const requestbyplace = (119 + 365) / 2;
    page.drawText(requestby1, {
      x: requestbyplace - requestbywidth / 2,
      y: 65,
      size: 9,
      font: Helveticabold,
    });
    const underlineStartX = requestbyplace - requestbywidth / 2; // Start position of the underline
    const underlineEndX = requestbyplace + requestbywidth / 2.4; // End position of the underline
    const underlineY = 63; // Slightly below the text position

    page.drawLine({
      start: { x: underlineStartX, y: underlineY },
      end: { x: underlineEndX, y: underlineY },
      thickness: 1, // Adjust line thickness as needed
      color: rgb(0, 0, 0), // Black color
    });
    const approvedby1 = (item[0].pr_details.campus_director_details.name || "").toUpperCase();
    const approvedbywidth = Helveticabold.widthOfTextAtSize(approvedby1, 10);
    const approvedbyplace = (365 + 564) / 2;
    page.drawText(approvedby1, {
      x: approvedbyplace - approvedbywidth / 2,
      y: 65,
      size: 9,
      font: Helveticabold,
    });
    const approvedbyStartX = approvedbyplace - approvedbywidth / 2; // Start position of the underline
    const approvedbyEndX = approvedbyplace + approvedbywidth / 2.4; // End position of the underline

    page.drawLine({
      start: { x: approvedbyStartX, y: underlineY },
      end: { x: approvedbyEndX, y: underlineY },
      thickness: 1, // Adjust line thickness as needed
      color: rgb(0, 0, 0), // Black color
    });

    const designation1 = item[0].pr_details.requisitioner_details.designation ?? "";
    const designationwidth = Helveticafont.widthOfTextAtSize(designation1, 11);
    const designationplace = (119 + 365) / 2;
    page.drawText(designation1, {
      x: designationplace - designationwidth / 2,
      y: 53,
      size: 8,
      font: Helveticafont,
    });

    const designation2 = item[0].pr_details.campus_director_details.designation || "";
    const designationwidth2 = Helveticafont.widthOfTextAtSize(designation2, 11);
    const designationplace2 = (385 + 564) / 2;
    page.drawText(designation2, {
      x: designationplace2 - designationwidth2 / 2,
      y: 53,
      size: 8,
      font: Helveticafont,
    });
    const Budgetname = "BETHANY B. URACA";
    const Bugdetofficer = Budgetname || "";
    const Bugdetofficerwidth = Helveticabold.widthOfTextAtSize(
      Bugdetofficer,
      11
    );
    const Bugdetofficerplace = (119 + 365) / 2;
    page.drawText(Bugdetofficer, {
      x: Bugdetofficerplace - Bugdetofficerwidth / 2,
      y: 185,
      size: 10,
      font: Helveticabold,
    });

    const BugdetofficerStartX = Bugdetofficerplace - Bugdetofficerwidth / 2; // Start position of the underline
    const BugdetofficerEndX = Bugdetofficerplace + Bugdetofficerwidth / 2.4; // End position of the underline
    const budgetlabel = "Bugdet Officer II";
    const budgetlabelwidth = Helveticafont.widthOfTextAtSize(budgetlabel, 11);
    page.drawText(budgetlabel, {
      x: Bugdetofficerplace - budgetlabelwidth / 2,
      y: 172,
      size: 10,
      font: Helveticafont,
    });

    page.drawLine({
      start: { x: BugdetofficerStartX, y: 183 },
      end: { x: BugdetofficerEndX, y: 183 },
      thickness: 1, // Adjust line thickness as needed
      color: rgb(0, 0, 0), // Black color
    });

    // Calculate total height required for the current item
    const itemHeight = Math.max(descriptionHeight, lineHeight);
    if (yPosition - itemHeight < footerHeight) {
      // Add footer to current page
      drawFooter(page, runningTotal, timesRomanFont, true);

      // Create a new page
      page = pdfDoc.addPage([612, pageHeight]);
      pages.push(page);

      yPosition = 574; // Reset yPosition for the new page
      pageIndex++;
      page.drawText(`Subtotal`, {
        x: 260,
        y: yPosition,
        size: 11,
        font: timesBoldFont,
        color: rgb(1, 0, 0),
      });
      const subtotalText = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(runningTotal);
      const subtotalWidth = timesRomanFont.widthOfTextAtSize(subtotalText, 11);
      page.drawText(subtotalText, {
        x: 560 - subtotalWidth,
        y: yPosition,
        size: 11,
        font: timesRomanFont,
        color: rgb(1, 0, 0),
      });
      yPosition -= lineHeight;
    }
    const totalamount = quantity * unit_cost;
    runningTotal += totalamount || 0;
    const stockPropertytext = stock_property_no.toString() || "";
    const stockPropertywidth = timesRomanFont.widthOfTextAtSize(
      stockPropertytext,
      10
    );
    const stockPropertyplace = (5 + 85) / 2;
    page.drawText(stockPropertytext, {
      x: stockPropertyplace - stockPropertywidth / 2,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    const unittext = unit || "";
    const unitwidth = timesRomanFont.widthOfTextAtSize(unittext, 11);
    const unitplace = (80 + 105) / 2;
    page.drawText(unittext, {
      x: unitplace - unitwidth / 2,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    wrappedDescription.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: 123,
        y: yPosition - lineIndex * lineHeight,
        size: 9,
        font: timesRomanFont,
      });
    });

    const quantitytext = quantity || "";
    const quantitywidth = timesRomanFont.widthOfTextAtSize(
      quantitytext.toString(),
      10
    );
    const quantityplace = (385 + 393) / 2;
    page.drawText(quantitytext.toString(), {
      x: quantityplace - quantitywidth / 2,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    const unitCostFormatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(unit_cost || 0);
    const unitCostWidth = timesRomanFont.widthOfTextAtSize(
      unitCostFormatted,
      10
    );
    const unitCostPlace = 475;
    page.drawText(unitCostFormatted, {
      x: unitCostPlace - unitCostWidth,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });

    const totalCostFormatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalamount || 0);

    const totalCostWidth = timesRomanFont.widthOfTextAtSize(
      totalCostFormatted,
      10
    );
    const totalCostPlace = 560;
    page.drawText(totalCostFormatted, {
      x: totalCostPlace - totalCostWidth,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    yPosition -= itemHeight + 5;
  });

  drawFooter(page, runningTotal, timesRomanFont, false);
  function drawFooter(
    page: PDFPage,
    total: number,
    font: PDFFont,
    isSubtotal: boolean
  ) {
    const label = isSubtotal ? `Subtotal` : `Total Amount`;
    const formattedTotal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);
    page.drawText(label, {
      x: 260,
      y: 228,
      size: 12,
      font,
      color: rgb(1, 0, 0),
    });
    const totalWidth = font.widthOfTextAtSize(formattedTotal, 12);
    page.drawText(formattedTotal, {
      x: 560 - totalWidth,
      y: 228,
      size: 12,
      font,
      color: rgb(1, 0, 0),
    });

    textandlines(
      // pdfDoc,
      page,
      timesBoldFont,
      timesRomanFont,
      timesRomanItalicFont,
      Helveticafont,
      item[0]
    );
  }
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  return url;
};
const textandlines = async (
  page: PDFPage,
  timesBoldFont: PDFFont,
  timesRomanFont: PDFFont,
  timesRomanItalicFont: PDFFont,
  Helveticafont: PDFFont,
  item: itemType
) => {
  page.drawText("PURCHASE REQUEST", {
    x: 201,
    y: 725,
    size: 14,
    font: timesBoldFont,
  });
  page.drawText("Appendix 60", {
    x: 490,
    y: 760,
    size: 9,
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

  // Horizontal and vertical lines.
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

  page.drawLine({
    start: { x: 480, y: 250 },
    end: { x: 564, y: 250 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 480, y: 223 },
    end: { x: 564, y: 223 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  const startX = 350;
  const endX = 478;
  const y = 230;
  const dashLength = 2.5;
  const gapLength = 1.5;

  let currentX = startX;

  while (currentX < endX) {
    // Calculate the end of the current dash
    const nextX = Math.min(currentX + dashLength, endX);

    // Draw a dash
    page.drawLine({
      start: { x: currentX, y: y },
      end: { x: nextX, y: y },
      thickness: 1,
      color: rgb(1, 0, 0),
    });

    // Update the position for the next dash
    currentX = nextX + gapLength;
  }

  // Add Fund Cluster label and editable field
  page.drawText("Fund Cluster:", {
    x: 369,
    y: 697,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("", { x: 130, y: 669, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 445, y: 695 },
    end: { x: 520, y: 695 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Office/Section:", {
    x: 30,
    y: 663,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText(item.pr_details.office, {
    x: 30,
    y: 650,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("PR No.:", { x: 125, y: 663, size: 11, font: timesBoldFont });
  page.drawText(item.pr_details.pr_no, {
    x: 170,
    y: 663,
    size: 11,
    font: timesBoldFont,
    color: rgb(0, 0.8, 0),
  });
  page.drawText("___________________", {
    x: 170,
    y: 663,
    size: 11,
    font: timesBoldFont,
    color: rgb(0, 0.8, 0),
  });
  page.drawText("Responsibility Center Code :", {
    x: 125,
    y: 645,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Date :", { x: 418, y: 663, size: 11, font: timesBoldFont });
  page.drawText(formatPrDate(item.pr_details.created_at), {
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
    color: rgb(0.8, 0, 0),
  });
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
  page.drawText("Allotment Available:", {
    x: 122,
    y: 210,
    size: 10,
    font: Helveticafont,
  });

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
    end: { x: 416, y: 240 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 416, y: 220 },
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
    end: { x: 70, y: 150 },
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
    end: { x: 365, y: 240 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 365, y: 220 },
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
};
