import { itemQuotationResponseType, quotationResponseType } from "@/types/response/request-for-qoutation";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";

export const generateRFQPDF = async (item: itemQuotationResponseType[], rfq: quotationResponseType) => {

  const pdfDoc = await PDFDocument.create();
  console.log(rfq)

  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  // text upper
  const itemperpage = 15;
  const pages = Math.ceil(item.length / itemperpage);
  for (let pageIndex = 0; pageIndex < pages; pageIndex++) {
    const page = pdfDoc.addPage([615.12, 936]);
    const pageItems = item.slice(
      pageIndex * itemperpage,
      (pageIndex + 1) * itemperpage
    );
    pageItems.forEach((entry, index) => {

      const yPosition1 = 505 - index * 14.3;

      // Safely handle itemnum
      const itemnumtext = index !== undefined ? (index + 1).toString() : "-";
      const itemnumwidth = timesRomanFont.widthOfTextAtSize(itemnumtext, 11);
      const itemnumplace = (5 + 85) / 2;
      page.drawText(itemnumtext, {
        x: itemnumplace - itemnumwidth / 2,
        y: yPosition1,
        size: 11,
        font: timesRomanFont,
      });

      page.drawText(entry.item_details.item_description || "", {
        x: 63,
        y: yPosition1,
        size: 11,
        font: timesRomanFont,
      });

      // Safely handle qty
      const quantitytext = entry.item_details.quantity !== undefined ? entry.item_details.quantity.toString() : "-";
      const quantitywidth = timesRomanFont.widthOfTextAtSize(quantitytext, 11);
      const quantityplace = (235 + 393) / 2;
      page.drawText(quantitytext, {
        x: quantityplace - quantitywidth / 2,
        y: yPosition1,
        size: 11,
        font: timesRomanFont,
      });

      // Safely handle unit
      const unittext = entry.item_details.unit || "-";
      const unitwidth = timesRomanFont.widthOfTextAtSize(unittext, 11);
      const unitplace = (290 + 393) / 2;
      page.drawText(unittext, {
        x: unitplace - unitwidth / 2,
        y: yPosition1,
        size: 11,
        font: timesRomanFont,
      });

      // Safely handle ABC with formatting
      const ABCValue = entry.item_details.unit_cost !== undefined ? entry.item_details.unit_cost : 0;
      const ABCFormatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(ABCValue));
      const ABCWidth = timesRomanFont.widthOfTextAtSize(ABCFormatted, 10);
      const ABCPlace = 425;
      page.drawText(ABCFormatted, {
        x: ABCPlace - ABCWidth,
        y: yPosition1,
        size: 10,
        font: timesRomanFont,
      });
    });

    await textandlines(
      pdfDoc,
      page,
      timesBoldFont,
      timesRomanFont,
      timesRomanItalicFont,
      rfq
    );
  }
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  return url; // Return the URL for preview/download
};


const textandlines = async (
  pdfDoc: PDFDocument,
  page: PDFPage,
  timesBoldFont: PDFFont,
  timesRomanFont: PDFFont,
  timesRomanItalicFont: PDFFont,
  rfq: quotationResponseType
) => {
  page.drawText("REQUEST FOR QUOTATION", {
    x: 215,
    y: 786,
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

  page.drawText(rfq.purchase_request, {
    x: 430,
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
  page.drawText(rfq.supplier_name, {
    x: 32.5,
    y: 725.02,
    size: 11,
    font: timesRomanFont,
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
  page.drawText(rfq.supplier_address, { x: 32.5, y: 695, size: 11, font: timesRomanFont });

  page.drawText("Address", { x: 32.5, y: 678, size: 11, font: timesRomanFont });
  page.drawText("TIN:", { x: 32.5, y: 664, size: 11, font: timesRomanFont });
  page.drawText(rfq.tin, { x: 65, y: 665, size: 11, font: timesRomanFont });
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
    y: 518,
    size: 8,
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
    start: { x: 30.52, y: 516 },
    end: { x: 585, y: 516 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 30.52, y: 502 },
    end: { x: 585, y: 502 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 488 },
    end: { x: 585, y: 488 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 474 },
    end: { x: 585, y: 474 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 460 },
    end: { x: 585, y: 460 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 446 },
    end: { x: 585, y: 446 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 432 },
    end: { x: 585, y: 432 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 418 },
    end: { x: 585, y: 418 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 404 },
    end: { x: 585, y: 404 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 390 },
    end: { x: 585, y: 390 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 376 },
    end: { x: 585, y: 376 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 362 },
    end: { x: 585, y: 362 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 348 },
    end: { x: 585, y: 348 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 334 },
    end: { x: 585, y: 334 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 320 },
    end: { x: 585, y: 320 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30.52, y: 306 },
    end: { x: 585, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  //Vertical Line
  page.drawLine({
    start: { x: 30.52, y: 555.5 },
    end: { x: 30.52, y: 306 },
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
    start: { x: 60, y: 516 },
    end: { x: 60, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 301, y: 555.5 },
    end: { x: 301, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 327, y: 527.5 },
    end: { x: 327, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 360, y: 555.5 },
    end: { x: 360, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 430, y: 555.5 },
    end: { x: 430, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 520, y: 541.5 },
    end: { x: 520, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 584.5, y: 555.5 },
    end: { x: 584.5, y: 306 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  const headerjpg = "/header.jpeg";
  const headerjpgBytes = await fetch(headerjpg).then((res) =>
    res.arrayBuffer()
  );
  const headerimage = await pdfDoc.embedJpg(headerjpgBytes);
  page.drawImage(headerimage, {
    x: 145,
    y: 808,
    width: 325,
    height: 62,
  });
  page.drawText("Republic of the Philippines", {
    x: 255,
    y: 858,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText("CEBU TECHNOLOGICAL UNIVERSITY", {
    x: 225,
    y: 848,
    size: 9,
    font: timesBoldFont,
  });
  page.drawText("ARGAO CAMPUS", {
    x: 275,
    y: 838,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText("Ed Kintanar Street, Lamacan, Argao Cebu Philippines", {
    x: 220,
    y: 830,
    size: 8,
    font: timesRomanFont,
  });
  page.drawText("Website:", { x: 212, y: 823, size: 7, font: timesRomanFont });
  page.drawText("http://www.argao.ctu.edu.ph ", {
    x: 237,
    y: 823,
    size: 7,
    font: timesRomanFont,
    color: rgb(0, 0, 1),
  });
  page.drawText("E-mail: cdargao@ctu.edu.ph", {
    x: 323,
    y: 823,
    size: 7,
    font: timesRomanFont,
  });
  page.drawText("Phone No.: (032) 401-0737 local 1700", {
    x: 255,
    y: 815,
    size: 7,
    font: timesRomanFont,
  });

  const jpgUrl = "/footer.jpeg";
  const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
  const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
  const jpgDims = jpgImage.scale(0.2);

  page.drawImage(jpgImage, {
    x: 145,
    y: 10,
    width: jpgDims.width,
    height: jpgDims.height,
  });
};
