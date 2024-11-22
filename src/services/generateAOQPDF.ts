import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { HeaderAndFooter } from "./HeaderAndFooter";
import { itemSelectedType_ } from "@/types/response/abstract-of-quotation";

export const generateAOQPDF = async (data: itemSelectedType_[]) => {

  const pdfDoc = await PDFDocument.create();
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const itemsPerPage = 5;

  const items = Array.isArray(data) ? data : []
 
  const pages = Math.ceil(items.length / Number(itemsPerPage));

  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const page = pdfDoc.addPage([936, 612]);
    let yPosition = 355;
    let yPosition1 = 353;
    const pageItems = items.slice(
      pageIndex * itemsPerPage,
      (pageIndex + 1) * itemsPerPage
    );

    pageItems.forEach((item, index) => {
      const numtext = (index + 1).toString() || "";
      const numwidth = timesRomanFont.widthOfTextAtSize(numtext, 11);
      const numplace = (4 +  91.5) / 2;
      page.drawText(numtext, { x: numplace - numwidth / 2, y: yPosition1, size: 12, font: timesRomanFont});
      const itemtext = item.item_details.item_details.item_description || "";
      const itemwidth = timesRomanFont.widthOfTextAtSize(itemtext, 12);
      const itemplace = (240 + 183.07) / 2;
      page.drawText(itemtext, { x: itemplace - itemwidth / 2, y: yPosition1, size: 12, font: timesRomanFont });
      const quantityText = item.item_details.item_details.quantity.toString() || "";
      const quantityWidth = timesRomanFont.widthOfTextAtSize(quantityText, 12);
      const quantityColumnCenter = (405 + 366.14) / 2; 
      page.drawText(quantityText, {  x: quantityColumnCenter - quantityWidth / 2, y: yPosition1, size: 11, font: timesRomanFont });
      const agencypricePriceText = item.item_details.item_details.unit_cost || "";
      const agencypricepricewidth = timesRomanFont.widthOfTextAtSize(agencypricePriceText, 12);
      page.drawText(agencypricePriceText, { x: 475 - agencypricepricewidth, y: yPosition1, size: 12, font: timesRomanFont });
      const winningbiddertext = item.rfq_details.supplier_name || "";
      const winningbidderwidth = timesRomanFont.widthOfTextAtSize(winningbiddertext, 11);
      const winningbidderplace = (580 + 663.31) / 2; 
      page.drawText(winningbiddertext, { x: winningbidderplace - winningbidderwidth / 2, y: yPosition1, size: 12, font: timesRomanFont });
      const winningPriceText = item.item_details.unit_price?.toString() || "";
      const winningpricewidth = timesRomanFont.widthOfTextAtSize(winningPriceText, 12);
      const winningpriceplace = 890; 
      page.drawText(winningPriceText, { x: winningpriceplace - winningpricewidth, y: yPosition1, size: 12, font: timesRomanFont });
      page.drawLine({
        start: { x: 29.53, y: yPosition - 5 },
        end: { x: 898.98, y: yPosition - 5 },
        thickness: 1.5,
        color: rgb(0, 0, 0),
      });
      yPosition -= 15;
      yPosition1 -= 15;
    });
    const verticalLinePositions = [
      29.53, 64.96, 366.14, 425.2, 480.31, 780.38, 898.5,
    ];
    verticalLinePositions.forEach((x) => {
      page.drawLine({
        start: { x, y: 375 },
        end: { x, y: yPosition + 10 }, // Align to the last row's y-position
        thickness: 1.5,
        color: rgb(0, 0, 0),
      });
    });
    const footerYPosition = yPosition - 20; // Adjust footer position based on items

    // Draw header and footer
    await HeaderAndFooter(
      pdfDoc,
      page,
      timesBoldFont,
      timesRomanFont,
      footerYPosition,
      timesBoldFont
    );
  }

  // Generate PDF Blob and display
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfBlobUrl = URL.createObjectURL(blob);
  return pdfBlobUrl;
};