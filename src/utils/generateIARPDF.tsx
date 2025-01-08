/* eslint-disable @typescript-eslint/no-unused-vars */
import { _itemsDeliveredType } from "@/types/request/purchase-order";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { formatPrDate } from "@/services/formatDate";

export const generateIARPDF = async (itemData: _itemsDeliveredType[]) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  const italicbold = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

  const maxWidth = 320;
  const lineHeight = 12;
  const footerHeight = 250;
  const pageHeight = 936;
  let yPosition = 685;

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
  itemData.forEach((data) => {
    const no = data.item_details.item_quotation_details.item_details.stock_property_no
    const unit = data.item_details.item_quotation_details.item_details.unit
    const description = data.item_details.item_quotation_details.item_details.item_description
    const quantity = data.item_details.item_quantity
    const unitcost = data.item_details.item_cost

    // Calculate height needed for wrapped description
    const wrappedDescription = wrapText(
      description,
      maxWidth,
      9
    );
    const descriptionHeight = wrappedDescription.length * lineHeight;

    // Calculate total height required for the current item
    const itemHeight = Math.max(descriptionHeight, lineHeight);

    // Check if the content will fit on the current page
    if (yPosition - itemHeight < footerHeight) {
      // Add footer to current page
      drawFooter(page);

      // Create a new page
      page = pdfDoc.addPage([612, pageHeight]);
      pages.push(page);

      yPosition = 685; // Reset yPosition for the new page
      pageIndex++;
    }

    // Draw content
    const totalamount = Number(quantity) *  Number(unitcost);

    runningTotal += totalamount || 0;

    // Stock/Property No.
    const stockPropertytext = no.toString() || "";
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

    // Description
    wrappedDescription.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: 90,
        y: yPosition - lineIndex * lineHeight,
        size: 9,
        font: timesRomanFont,
      });
    });

    // Quantity
    const quantitytext = quantity.toString() || "";
    const quantitywidth = timesRomanFont.widthOfTextAtSize(quantitytext, 9);
    const quantityplace = (500 + 578) / 2;
    page.drawText(quantitytext, {
      x: quantityplace - quantitywidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });

    // Unit Cost
    const unit1 = unit.toString() || "";
    const unitWidth = timesRomanFont.widthOfTextAtSize(unit1, 10);
    const unitPlace = (430 + 500) / 2;
    page.drawText(unit1, {
      x: unitPlace - unitWidth / 2,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });

    // Update yPosition for the next item
    yPosition -= itemHeight + 5; // Add spacing between items
  });

  // Final Footer
  drawFooter(page);

  function drawFooter(page: PDFPage) {
    textandlines(
      page,
      timesBoldFont,
      timesRomanFont,
      timesRomanItalicFont,
      italicbold,
      itemData[0],
    );
  }
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
  italicbold: PDFFont,
  data: _itemsDeliveredType,
) => {
  const formname = "INSPECTION AND ACCEPTANCE REPORT";
  const formname1 = formname || "";
  const formnamewidth = timesBoldFont.widthOfTextAtSize(formname1, 14);
  const formnameplace = (0 + 612) / 2;
  page.drawText(formname1, {
    x: formnameplace - formnamewidth / 2,
    y: 854,
    size: 14,
    font: timesBoldFont,
  });

  const entityname = "Cebu Technological University-Argao Campus";
  const entityname1 = entityname || "";
  const entitynamewidth = timesRomanFont.widthOfTextAtSize(entityname1, 13);
  const entitynameplace = (72 + 384) / 2;
  page.drawText(entityname1, {
    x: entitynameplace - entitynamewidth / 2,
    y: 823,
    size: 12,
    font: timesRomanFont,
  });
  const approvedbyStartX = entitynameplace - entitynamewidth / 2; // Start position of the underline
  const approvedbyEndX = entitynameplace + entitynamewidth / 2.3; // End position of the underline

  page.drawLine({
    start: { x: approvedbyStartX, y: 821 },
    end: { x: approvedbyEndX, y: 821 },
    thickness: 1, // Adjust line thickness as needed
    color: rgb(0, 0, 0), // Black color
  });

  page.drawText("Appendix 63", {
    x: 495,
    y: 900,
    size: 9,
    font: timesRomanItalicFont,
  });
  page.drawText("Entity Name:", {
    x: 38,
    y: 823,
    size: 12,
    font: timesRomanFont,
  });
  page.drawText("Fund Cluster:", {
    x: 430,
    y: 823,
    size: 12,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 500, y: 823 },
    end: { x: 570, y: 823 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Supplier:", { x: 40, y: 800, size: 11, font: timesRomanFont });
  page.drawText(data.inspection_details.po_details.rfq_details.supplier_name, { x: 90, y: 800, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 85, y: 797 },
    end: { x: 428, y: 797 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("P.O. No. / Date:", {
    x: 40,
    y: 780,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(data.inspection_details.po_details.po_no, {
    x: 120,
    y: 780,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(formatPrDate(data.inspection_details.created_at), {
    x: 240,
    y: 780,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 115, y: 777 },
    end: { x: 428, y: 777 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Requisitioning Office/Dept. :", {
    x: 40,
    y: 760,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(data.inspection_details.po_details.pr_details.office, {
    x: 180,
    y: 760,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 170, y: 757 },
    end: { x: 428, y: 757 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Responsibility Center Code :", {
    x: 40,
    y: 740,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText(data.inspection_details.po_details.pr_details.res_center_code ?? "", {
    x: 180,
    y: 740,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 170, y: 737 },
    end: { x: 428, y: 737 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("IAR No.:", { x: 455, y: 800, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 500, y: 797 },
    end: { x: 570, y: 797 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Date :", { x: 469, y: 780, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 500, y: 777 },
    end: { x: 570, y: 777 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Invoice No. :", {
    x: 438,
    y: 760,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 500, y: 757 },
    end: { x: 570, y: 757 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Date :", { x: 469, y: 740, size: 11, font: timesRomanFont });
  page.drawLine({
    start: { x: 500, y: 737 },
    end: { x: 570, y: 737 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  const stocknum = "Stock/";
  const stocknum1 = stocknum || "";
  const stocknumwidth = italicbold.widthOfTextAtSize(stocknum1, 8);
  const stocknumplace = (34 + 85) / 2;
  page.drawText(stocknum1, {
    x: stocknumplace - stocknumwidth / 2,
    y: 720,
    size: 8,
    font: italicbold,
  });
  const propertynum = "Property No.";
  const propertynumwidth = italicbold.widthOfTextAtSize(propertynum, 8);
  const propertynumplace = (34 + 85) / 2;
  page.drawText(propertynum, {
    x: propertynumplace - propertynumwidth / 2,
    y: 710,
    size: 8,
    font: italicbold,
  });
  const description = "Description";
  const descwidth = italicbold.widthOfTextAtSize(description, 11);
  const descplace = (85 + 430) / 2;
  page.drawText(description, {
    x: descplace - descwidth / 2,
    y: 712,
    size: 11,
    font: italicbold,
  });
  const unit = "Unit";
  const unitwidth = italicbold.widthOfTextAtSize(unit, 10);
  const unitplace = (430 + 500) / 2;
  page.drawText(unit, {
    x: unitplace - unitwidth / 2,
    y: 712,
    size: 10,
    font: italicbold,
  });
  const quantity = "Quantity";
  const quantitywidth = italicbold.widthOfTextAtSize(quantity, 10);
  const quantityplace = (500 + 578) / 2;
  page.drawText(quantity, {
    x: quantityplace - quantitywidth / 2,
    y: 712,
    size: 10,
    font: italicbold,
  });
  const inspection = "INSPECTION";
  const inspectionwidth = italicbold.widthOfTextAtSize(inspection, 12);
  const inspectionplace = (34 + 329) / 2;
  page.drawText(inspection, {
    x: inspectionplace - inspectionwidth / 2,
    y: 237,
    size: 12,
    font: italicbold,
  });

  const acceptance = "ACCEPTANCE";
  const acceptancewidth = italicbold.widthOfTextAtSize(acceptance, 12);
  const acceptanceplace = (329 + 578) / 2;
  page.drawText(acceptance, {
    x: acceptanceplace - acceptancewidth / 2,
    y: 237,
    size: 12,
    font: italicbold,
  });
  page.drawText("Data Inspected:", {
    x: 45,
    y: 205,
    size: 11,
    font: timesBoldFont,
  });
  page.drawRectangle({
    x: 45,
    y: 155,
    width: 25,
    height: 20,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawRectangle({
    x: 340,
    y: 165,
    width: 25,
    height: 20,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawRectangle({
    x: 340,
    y: 135,
    width: 25,
    height: 20,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("Inspected, verified and found in order as to", {
    x: 85,
    y: 175,
    size: 12,
    font: timesRomanFont,
  });
  page.drawText("quantity and specifications", {
    x: 115,
    y: 160,
    size: 12,
    font: timesRomanFont,
  });
  page.drawText("Data Received :", {
    x: 345,
    y: 205,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Complete", { x: 375, y: 170, size: 12, font: timesRomanFont });
  page.drawText("Partial (pls. specify quantity)", {
    x: 375,
    y: 140,
    size: 11,
    font: timesRomanFont,
  });
  const sopcname = "ERA JAYNE B. TANDINGAN";
  const sopcnamewidth = timesBoldFont.widthOfTextAtSize(sopcname, 13);
  const sopcnameplace = (329 + 578) / 2;
  page.drawText(sopcname, {
    x: sopcnameplace - sopcnamewidth / 2,
    y: 100,
    size: 12,
    font: timesBoldFont,
  });
  const sopcnameStartX = sopcnameplace - sopcnamewidth / 2; // Start position of the underline
  const sopcnameEndX = sopcnameplace + sopcnamewidth / 2.3; // End position of the underline
  page.drawLine({
    start: { x: sopcnameStartX, y: 98 },
    end: { x: sopcnameEndX, y: 98 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  const sopc = "Supply Officer and/or Property Custodian";
  const sopcwidth = timesRomanFont.widthOfTextAtSize(sopc, 12);
  const sopcplace = (329 + 578) / 2;
  page.drawText(sopc, {
    x: sopcplace - sopcwidth / 2,
    y: 85,
    size: 12,
    font: timesRomanFont,
  });
  const ioicname = "JOSEPHINE M. CABARDO";
  const ioicnamewidth = timesBoldFont.widthOfTextAtSize(ioicname, 13);
  const ioicnameplace = (34 + 329) / 2;
  page.drawText(ioicname, {
    x: ioicnameplace - ioicnamewidth / 2,
    y: 100,
    size: 12,
    font: timesBoldFont,
  });
  const ioicnameStartX = ioicnameplace - ioicnamewidth / 2; // Start position of the underline
  const ioicnameEndX = ioicnameplace + ioicnamewidth / 2.3; // End position of the underline
  page.drawLine({
    start: { x: ioicnameStartX, y: 98 },
    end: { x: ioicnameEndX, y: 98 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  const ioic = "Inspection Officer/Inspection Committee";
  const ioicwidth = timesRomanFont.widthOfTextAtSize(ioic, 12);
  const ioicplace = (34 + 329) / 2;
  page.drawText(ioic, {
    x: ioicplace - ioicwidth / 2,
    y: 85,
    size: 12,
    font: timesRomanFont,
  });

  //Horizontal Line

  page.drawLine({
    start: { x: 34, y: 814 },
    end: { x: 578, y: 814 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //1st
  page.drawLine({
    start: { x: 34, y: 732 },
    end: { x: 578, y: 732 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //2nd

  page.drawLine({
    start: { x: 34, y: 700 },
    end: { x: 578, y: 700 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //3th

  page.drawLine({
    start: { x: 34, y: 255 },
    end: { x: 578, y: 255 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 227 },
    end: { x: 578, y: 227 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 34, y: 62 },
    end: { x: 578, y: 62 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  //Vertical Line
  page.drawLine({
    start: { x: 34, y: 814 },
    end: { x: 34, y: 62 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); // left-side line
  page.drawLine({
    start: { x: 578, y: 814 },
    end: { x: 578, y: 62 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); // right-side line
  page.drawLine({
    start: { x: 85, y: 732 },
    end: { x: 85, y: 255 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 430, y: 814 },
    end: { x: 430, y: 255 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 500, y: 732 },
    end: { x: 500, y: 255 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 329, y: 255 },
    end: { x: 329, y: 62 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 229, y: 795 },
    end: { x: 224, y: 778 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
};
