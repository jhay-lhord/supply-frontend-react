/* eslint-disable @typescript-eslint/no-unused-vars */
import { _itemsDeliveredType } from "@/types/request/purchase-order";
import { purchaseOrderItemType_ } from "@/types/response/purchase-order";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { formatPrDate } from "./formatDate";


export const generatePOPDF = async (purchaseOrderItem: purchaseOrderItemType_[]) => {

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  const customFontBytes = await fetch("/Arial/arial.TTF").then((res) =>
    res.arrayBuffer()
  );
  console.log(customFontBytes)
  const customFont = await pdfDoc.embedFont(customFontBytes);

  const maxWidth = 220;
  const lineHeight = 12;
  const footerHeight = 329;
  const pageHeight = 936;
  let yPosition = 632;

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
  const pages = []; // Array to hold pages
  let pageIndex = 0; // Page counter
  let page = pdfDoc.addPage([612, pageHeight]);
  pages.push(page);
  purchaseOrderItem.forEach((item, index) => {
    const item_description = item.supplier_item_details.item_quotation_details.item_details.item_description ?? ""
    const unit_price = item.supplier_item_details.item_cost
    const quantity = item.supplier_item_details.item_quantity
    const unit = item.supplier_item_details.item_quotation_details.item_details.unit 
    const unit_cost = item.supplier_item_details.item_cost

    // Calculate height needed for wrapped description
    const wrappedDescription = wrapText(
      item_description,
      maxWidth,
      9
    );
    const descriptionHeight = wrappedDescription.length * lineHeight;

    // Calculate total height required for the current item
    const itemHeight = Math.max(descriptionHeight, lineHeight);

    // Check if the content will fit on the current page
    if (yPosition - itemHeight < footerHeight) {
      // Add footer to current page
      drawFooter(page, runningTotal, timesRomanFont, true);

      // Create a new page
      page = pdfDoc.addPage([612, pageHeight]);
      pages.push(page);

      yPosition = 630; // Reset yPosition for the new page
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

    // Draw content
    const totalamount = Number(unit_price) * Number(quantity);
    runningTotal += totalamount || 0;

    // Stock/Property No.
    const stockPropertytext = (index + 1).toString() || "";
    const stockPropertywidth = timesRomanFont.widthOfTextAtSize(
      stockPropertytext,
      9
    );
    const stockPropertyplace = (30 + 85) / 2;
    page.drawText(stockPropertytext, {
      x: stockPropertyplace - stockPropertywidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });
    // Unit
    const unittext = unit ?? "";
    const unitwidth = timesRomanFont.widthOfTextAtSize(unittext, 9);
    const unitplace = (125 + 105) / 2;
    page.drawText(unittext, {
      x: unitplace - unitwidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });
    // Description
    wrappedDescription.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: 145,
        y: yPosition - lineIndex * lineHeight,
        size: 9,
        font: timesRomanFont,
      });
    });

    // Quantity
    const quantitytext = quantity.toString() ?? "";
    const quantitywidth = timesRomanFont.widthOfTextAtSize(quantitytext, 9);
    const quantityplace = (395 + 393) / 2;
    page.drawText(quantitytext, {
      x: quantityplace - quantitywidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });

    // Unit Cost
    const unitCostFormatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(unit_cost) || 0);
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

    const totalcost1 = Number(quantity) * Number(unit_cost);
    const totalCostFormatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalcost1 || 0);
    const totalCostWidth = timesRomanFont.widthOfTextAtSize(
      totalCostFormatted,
      9
    );
    const totalCostPlace = 560;
    page.drawText(totalCostFormatted, {
      x: totalCostPlace - totalCostWidth,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });

    // Update yPosition for the next item
    yPosition -= itemHeight + 5; // Add spacing between items
  });

  // Final Footer
  drawFooter(page, runningTotal, timesRomanFont, false);

  function drawFooter(page:PDFPage, total:number, font: PDFFont, isSubtotal:boolean) {
    const label = isSubtotal ? `         Subtotal` : `Total Amount`;
    const formattedTotal = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);
    page.drawText(label, {
      x: 260,
      y: 322,
      size: 12,
      font,
      color: rgb(1, 0, 0),
    });
    const totalWidth = font.widthOfTextAtSize(formattedTotal, 12);
    page.drawText(formattedTotal, {
      x: 560 - totalWidth,
      y: 322,
      size: 12,
      font,
      color: rgb(1, 0, 0),
    });

    textandlines(
      page,
      timesBoldFont,
      timesRomanFont,
      timesRomanItalicFont,
      customFont,
      purchaseOrderItem[0]
    );
  }
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  return url;
};

const textandlines = async (
  page:PDFPage,
  timesBoldFont: PDFFont,
  timesRomanFont: PDFFont,
  timesRomanItalicFont: PDFFont,
  customFont: PDFFont,
  purchaseOrderData: purchaseOrderItemType_
) => {
  page.drawText("Appendix 61", {
    x: 495,
    y: 900,
    size: 9,
    font: timesRomanItalicFont,
  });
  page.drawText("PURCHASE ORDER", {
    x: 235,
    y: 825,
    size: 14,
    font: timesBoldFont,
  });
  page.drawText("Supplier:", { x: 40, y: 790, size: 11, font: timesRomanFont });
  page.drawText(purchaseOrderData.supplier_item_details.rfq_details.supplier_name, { x: 90, y: 790, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 85, y: 787 },
    end: { x: 371, y: 787 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Address:", { x: 40, y: 775, size: 11, font: timesRomanFont });
  page.drawText(purchaseOrderData.supplier_item_details.rfq_details.supplier_address, { x: 90, y: 775, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 85, y: 772 },
    end: { x: 371, y: 772 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("TIN:", { x: 58, y: 760, size: 11, font: timesRomanFont });
  page.drawText(purchaseOrderData.supplier_item_details.rfq_details.tin, { x: 90, y: 760, size: 11, font: timesRomanFont });
  page.drawText("P.O. No. :", {
    x: 375,
    y: 790,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(purchaseOrderData.po_details.po_no, {
    x: 430,
    y: 790,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 425, y: 787 },
    end: { x: 552, y: 787 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("      Date :", {
    x: 375,
    y: 775,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(formatPrDate(purchaseOrderData.created_at), {
    x: 430,
    y: 775,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 425, y: 772 },
    end: { x: 552, y: 772 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Mode of Procurement :", {
    x: 375,
    y: 760,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(purchaseOrderData.pr_details.mode_of_procurement, {
    x: 480,
    y: 760,
    size: 9,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 480, y: 757 },
    end: { x: 552, y: 757 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Gentlemen:", {
    x: 45,
    y: 740,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(
    "Please furnish this Office the following articles subject to the terms and conditions contained herein:",
    { x: 85, y: 728, size: 11, font: timesRomanFont }
  );
  page.drawText("Place of Delivery:", {
    x: 40,
    y: 705,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 125, y: 702 },
    end: { x: 298, y: 702 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Date of Delivery:", {
    x: 40,
    y: 692,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 125, y: 690 },
    end: { x: 298, y: 690 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Delivery Term:", {
    x: 375,
    y: 705,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 445, y: 702 },
    end: { x: 560, y: 702 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Payment Term:", {
    x: 375,
    y: 692,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 445, y: 690 },
    end: { x: 560, y: 690 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Stock/", { x: 45, y: 675, size: 11, font: timesRomanFont });
  page.drawText("Property", { x: 40, y: 662, size: 11, font: timesRomanFont });
  page.drawText("No.", { x: 50, y: 649, size: 11, font: timesRomanFont });
  page.drawText("Unit", { x: 100, y: 662, size: 11, font: timesRomanFont });
  page.drawText("Description", {
    x: 220,
    y: 662,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Quantity", { x: 375, y: 662, size: 11, font: timesRomanFont });
  page.drawText("Unit Cost", {
    x: 430,
    y: 662,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Amount", { x: 505, y: 662, size: 11, font: timesRomanFont });
  page.drawText("₱", { x: 480, y: 322, size: 14, font: customFont });

  page.drawText(
    "In case of failure to make the full delivery within the time specified above, a penalty of one-tenth (1/10) of one percent for",
    { x: 55, y: 300, size: 10, font: timesRomanFont }
  );
  page.drawText(
    "every day of delay shall be imposed on the undelivered item/s.",
    { x: 40, y: 290, size: 10, font: timesRomanFont }
  );
  page.drawText("Conforme:", { x: 70, y: 260, size: 10, font: timesRomanFont });
  page.drawText("Very truly yours,", {
    x: 380,
    y: 260,
    size: 10,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 120, y: 230 },
    end: { x: 310, y: 230 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Signature over Printed Name of Supplier", {
    x: 130,
    y: 220,
    size: 10,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 370, y: 230 },
    end: { x: 560, y: 230 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Signature over Printed Name of Authorized", {
    x: 380,
    y: 220,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText("Official", { x: 450, y: 208, size: 10, font: timesRomanFont });
  page.drawLine({
    start: { x: 135, y: 190 },
    end: { x: 272, y: 190 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Date", { x: 195, y: 178, size: 11, font: timesRomanFont });
  page.drawText("Campus Director", {
    x: 430,
    y: 190,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 430, y: 188 },
    end: { x: 507, y: 188 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Designation", {
    x: 440,
    y: 178,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Fund Cluster :", {
    x: 40,
    y: 150,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Fund Available :", {
    x: 40,
    y: 135,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 105, y: 147 },
    end: { x: 280, y: 147 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 115, y: 132 },
    end: { x: 280, y: 132 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("ORS/BURS No. :", {
    x: 378,
    y: 150,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Date of the ORS/BURS :", {
    x: 378,
    y: 135,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Amount :", { x: 378, y: 115, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 460, y: 147 },
    end: { x: 565, y: 147 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 490, y: 132 },
    end: { x: 565, y: 132 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 425, y: 112 },
    end: { x: 565, y: 112 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  const startX = 335;
  const endX = 475;
  const y = 325;
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
      thickness: 2,
      color: rgb(1, 0, 0),
    });

    // Update the position for the next dash
    currentX = nextX + gapLength;
  }
  //Horizontal Line

  page.drawLine({
    start: { x: 34, y: 806 },
    end: { x: 567, y: 806 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //1st
  page.drawLine({
    start: { x: 34, y: 750 },
    end: { x: 567, y: 750 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //2nd
  page.drawLine({
    start: { x: 34, y: 716 },
    end: { x: 567, y: 716 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //3rd
  page.drawLine({
    start: { x: 34, y: 686 },
    end: { x: 567, y: 686 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //4th
  page.drawLine({
    start: { x: 34, y: 644 },
    end: { x: 567, y: 644 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 337 },
    end: { x: 567, y: 337 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 315 },
    end: { x: 567, y: 315 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 162 },
    end: { x: 567, y: 162 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 68 },
    end: { x: 567, y: 68 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  //Vertical Line
  page.drawLine({
    start: { x: 34, y: 806 },
    end: { x: 34, y: 68 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); // left-side line
  page.drawLine({
    start: { x: 567, y: 806 },
    end: { x: 567, y: 68 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); // right-side line
  page.drawLine({
    start: { x: 85, y: 686 },
    end: { x: 85, y: 337 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 142, y: 686 },
    end: { x: 142, y: 337 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 370, y: 716 },
    end: { x: 370, y: 337 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 420, y: 686 },
    end: { x: 420, y: 337 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 480, y: 686 },
    end: { x: 480, y: 337 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 370, y: 162 },
    end: { x: 370, y: 68 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
};
