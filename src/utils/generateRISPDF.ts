import { _itemsDeliveredType } from "@/types/request/purchase-order";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { formatDate } from "./formateDate";

type collectedDataType = {
  divisiontext: string
  officetext: string
  resccodetext: string
  risnumtext: string
  requestpnametext: string
  requestDesigtxt: string
  requestDatetxt: string
  issuepnametext: string
  issueDesigtxt: string
  issuetDatetxt: string
  receivepnametext: string
  receiveDesigtxt: string
  receiveDatetxt: string
};

export const generateRISPDF = async (itemData: _itemsDeliveredType[]) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  const timesRomanItalicFontBold = await pdfDoc.embedFont(
    StandardFonts.TimesRomanBoldItalic
  );
  const customFontBytes = await fetch("/Arial/arial.TTF").then((res) =>
    res.arrayBuffer()
  );
  const customFont = await pdfDoc.embedFont(customFontBytes);
  const helvecfontbold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const Helveticafont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const maxWidth = 220;
  const lineHeight = 12;
  const footerHeight = 260;
  const pageHeight = 936;
  let yPosition = 708;

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
  let page = pdfDoc.addPage([612, pageHeight]);
  pages.push(page);
  const purposewidth = 580;
  const firstPurpose = itemData[0]?.inspection_details.po_details.pr_details.purpose ?? "";
  const firstPurposeSplit = wrapText(firstPurpose, purposewidth, 12);
  const divisiontext = "Admin";
  const officetext = itemData[0]?.inspection_details.po_details.pr_details.office ?? "";
  const resccodetext = itemData[0]?.inspection_details.po_details.pr_details.res_center_code ?? "";
  const risnumtext = itemData[0]?.inspection_details.po_details.pr_details.pr_no ?? "";
  const requestpnametext = itemData[0]?.inspection_details.po_details.pr_details.requisitioner_details.name ?? "";
  const requestDesigtxt = itemData[0]?.inspection_details.po_details.pr_details.requisitioner_details.designation ?? "";
  const requestDatetxt = formatDate(itemData[0]?.inspection_details.po_details.pr_details.created_at)?? "";
  const issuepnametext =  "sample";
  const issueDesigtxt = "sample";
  const issuetDatetxt = "";
  const receivepnametext = "";
  const receiveDesigtxt = "";
  const receiveDatetxt = "";
  const collectedData: collectedDataType[] = [];
  collectedData.push({
    divisiontext,
    officetext,
    resccodetext,
    risnumtext,
    requestpnametext,
    requestDesigtxt,
    requestDatetxt,
    issuepnametext,
    issueDesigtxt,
    issuetDatetxt,
    receivepnametext,
    receiveDesigtxt,
    receiveDatetxt,
  });
  itemData.forEach((data) => {
    const no = data.item_details.item_quotation_details.item_details.stock_property_no;
    const unit = data.item_details.item_quotation_details.item_details.unit;
    const description =
      data.item_details.item_quotation_details.item_details.item_description;
    const quantity = data.item_details.item_quotation_details.item_details.quantity;
    
    // Calculate height needed for wrapped description
    const wrappedDescription = wrapText(description, maxWidth, 9);
    const descriptionHeight = wrappedDescription.length * lineHeight;

    // Calculate total height required for the current item
    const itemHeight = Math.max(descriptionHeight, lineHeight);

    // Check if the content will fit on the current page
    if (yPosition - itemHeight < footerHeight) {
      textandlines(
        pdfDoc,
        page,
        timesBoldFont,
        timesRomanFont,
        timesRomanItalicFont,
        customFont,
        timesRomanItalicFontBold,
        helvecfontbold,
        firstPurposeSplit,
        lineHeight,
        collectedData,
        Helveticafont
      );
      // Create a new page
      page = pdfDoc.addPage([612, pageHeight]);
      pages.push(page);

      yPosition = 708; // Reset yPosition for the new page
    }

    // Draw content

    // Stock/Property No.
    const stockPropertytext = no.toString() || "";
    const stockPropertywidth = timesRomanFont.widthOfTextAtSize(
      stockPropertytext,
      9
    );
    const stockPropertyplace = (34 + 64) / 2;
    page.drawText(stockPropertytext, {
      x: stockPropertyplace - stockPropertywidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });
    // Unit
    const unittext = unit || "";
    const unitwidth = timesRomanFont.widthOfTextAtSize(unittext, 9);
    const unitplace = (64 + 101) / 2;
    page.drawText(unittext, {
      x: unitplace - unitwidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });
    // Description
    wrappedDescription.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: 104,
        y: yPosition - lineIndex * lineHeight,
        size: 9,
        font: timesRomanFont,
      });
    });

    // Quantity
    const quantitytext = quantity.toString() || "";
    const quantitywidth = timesRomanFont.widthOfTextAtSize(quantitytext, 9);
    const quantityplace = (295 + 332) / 2;
    const quantityplace1 = (397 + 471) / 2;
    page.drawText(quantitytext, {
      x: quantityplace - quantitywidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });
    page.drawText(quantitytext, {
      x: quantityplace1 - quantitywidth / 2,
      y: yPosition,
      size: 9,
      font: timesRomanFont,
    });
    // Update yPosition for the next item
    yPosition -= itemHeight + 5; // Add spacing between items
  });

  await textandlines(
    pdfDoc,
    page,
    timesBoldFont,
    timesRomanFont,
    timesRomanItalicFont,
    customFont,
    timesRomanItalicFontBold,
    helvecfontbold,
    firstPurposeSplit,
    lineHeight,
    collectedData,
    Helveticafont
  );

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return url;
};

const textandlines = async (
  pdfDoc: PDFDocument,
  page: PDFPage,
  timesBoldFont: PDFFont,
  timesRomanFont: PDFFont,
  timesRomanItalicFont: PDFFont,
  customFont: PDFFont,
  timesRomanItalicFontBold: PDFFont,
  helvecfontbold: PDFFont,
  firstPurposeSplit: string[],
  lineHeight: number,
  collectedData: collectedDataType[],
  Helveticafont: PDFFont
) => {
  collectedData.forEach((data) => {
    page.drawText(data.divisiontext, {
      x: 95,
      y: 780,
      size: 9,
      font: customFont,
    });
    page.drawText(data.officetext, {
      x: 95,
      y: 765,
      size: 9,
      font: helvecfontbold,
    });
    page.drawText(data.resccodetext, {
      x: 480,
      y: 780,
      size: 8,
      font: Helveticafont,
    });
    const risnum1 = data.risnumtext || "";
    const risnum1width = customFont.widthOfTextAtSize(risnum1, 8);
    const risnum1place = 420;
    page.drawText(risnum1, {
      x: risnum1place,
      y: 765,
      size: 8,
      font: customFont,
    });
    const underlineStartX = risnum1place; // Start position of the underline
    const underlineEndX = risnum1width + risnum1place; // End position of the underline
    const underlineY = 764;
    page.drawLine({
      start: { x: underlineStartX, y: underlineY },
      end: { x: underlineEndX, y: underlineY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    const requestpnametxt = (data.requestpnametext || "").toUpperCase();
    const rpnamewidth = helvecfontbold.widthOfTextAtSize(requestpnametxt, 7);
    const rpnameplace = (101 + 295) / 2;
    page.drawText(requestpnametxt, {
      x: rpnameplace - rpnamewidth / 2,
      y: 155,
      size: 7,
      font: helvecfontbold,
    });
    const requestDesigtext = data.requestDesigtxt || "";
    const rdwidth = Helveticafont.widthOfTextAtSize(requestDesigtext, 8);
    page.drawText(requestDesigtext, {
      x: rpnameplace - rdwidth / 2,
      y: 138,
      size: 8,
      font: Helveticafont,
    });
    const requestDatetext = data.requestDatetxt;
    const rdatewidth = Helveticafont.widthOfTextAtSize(
      requestDatetext.toLocaleString(),
      8
    );
    page.drawText(requestDatetext.toLocaleString(), {
      x: rpnameplace - rdatewidth / 2,
      y: 119,
      size: 8,
      font: Helveticafont,
    });

    const issuepnametxt = (data.issuepnametext || "").toUpperCase();
    const ipnamewidth = helvecfontbold.widthOfTextAtSize(issuepnametxt, 7);
    const ipnameplace = (366 + 471) / 2;
    page.drawText(issuepnametxt, {
      x: ipnameplace - ipnamewidth / 2,
      y: 155,
      size: 7,
      font: helvecfontbold,
    });
    const issueDesigtext = data.issueDesigtxt || "";
    const idwidth = Helveticafont.widthOfTextAtSize(issueDesigtext, 8);
    page.drawText(issueDesigtext, {
      x: ipnameplace - idwidth / 2,
      y: 138,
      size: 8,
      font: Helveticafont,
    });
    const issueDatetext1 = data.issuetDatetxt || "";
    const idatewidth = Helveticafont.widthOfTextAtSize(issueDatetext1, 8);
    page.drawText(issueDatetext1, {
      x: ipnameplace - idatewidth / 2,
      y: 119,
      size: 8,
      font: Helveticafont,
    });

    const receivepnametxt = (data.receivepnametext || "").toUpperCase();
    const repnamewidth = helvecfontbold.widthOfTextAtSize(receivepnametxt, 7);
    const repnameplace = (471 + 577) / 2;
    page.drawText(receivepnametxt, {
      x: repnameplace - repnamewidth / 2,
      y: 155,
      size: 7,
      font: helvecfontbold,
    });
    const receiveDesigtext = data.receiveDesigtxt || "";
    const redwidth = Helveticafont.widthOfTextAtSize(receiveDesigtext, 8);
    page.drawText(receiveDesigtext, {
      x: repnameplace - redwidth / 2,
      y: 138,
      size: 8,
      font: Helveticafont,
    });
    const receiveDatetext = data.receiveDatetxt || "";
    const redatewidth = Helveticafont.widthOfTextAtSize(receiveDatetext, 8);
    page.drawText(receiveDatetext, {
      x: repnameplace - redatewidth / 2,
      y: 119,
      size: 8,
      font: Helveticafont,
    });
  });
  const headertext1 = "SUPPLY AND PROPERTY MANAGEMENT OFFICE";
  const headertextwidth1 = helvecfontbold.widthOfTextAtSize(headertext1, 9);
  const headertextplace1 = (0 + 612) / 2;
  page.drawText(headertext1, {
    x: headertextplace1 - headertextwidth1 / 2,
    y: 850,
    size: 9,
    font: helvecfontbold,
  });
  const headertext = "REQUISITION AND ISSUE SLIP";
  const headertextwidth = timesBoldFont.widthOfTextAtSize(headertext, 11);
  const headertextplace = (0 + 612) / 2;
  page.drawText(headertext, {
    x: headertextplace - headertextwidth / 2,
    y: 825,
    size: 11,
    font: timesBoldFont,
  });
  firstPurposeSplit.forEach((line, lineIndex) => {
    page.drawText(line, {
      x: 100,
      y: 250 - lineIndex * lineHeight,
      size: 9,
      font: timesRomanFont,
    });
  });

  page.drawText("Appendix 63", {
    x: 525,
    y: 900,
    size: 8,
    font: timesRomanItalicFont,
  });

  page.drawText("Entity Name:", {
    x: 40,
    y: 805,
    size: 10,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 105, y: 803 },
    end: { x: 217, y: 803 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("CTU - ARGAO CAMPUS", {
    x: 105,
    y: 805,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText("Division:", {
    x: 50,
    y: 780,
    size: 10,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 95, y: 778 },
    end: { x: 300, y: 778 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("Office:", { x: 55, y: 765, size: 10, font: timesRomanFont });
  page.drawText("Fund Cluster:", {
    x: 405,
    y: 805,
    size: 11,
    font: timesRomanFont,
  });
  // page.drawLine({start: { x: 425, y: 787 }, end: { x: 552, y: 787 }, thickness: 1 , color: rgb(0, 0, 0)});
  page.drawText("Responsibility Center Code:", {
    x: 370,
    y: 780,
    size: 9,
    font: timesRomanFont,
  });
  // page.drawLine({start: { x: 425, y: 772 }, end: { x: 552, y: 772 }, thickness: 1 , color: rgb(0, 0, 0)});
  page.drawText("RIS No. :", {
    x: 370,
    y: 765,
    size: 10,
    font: timesRomanFont,
  });
  // page.drawLine({start: { x: 480, y: 757 }, end: { x: 552, y: 757 }, thickness: 1 , color: rgb(0, 0, 0)});
  const stocktext = "Stock";
  const stocktextwidth = timesRomanFont.widthOfTextAtSize(stocktext, 10);
  const stocktextplace = (34 + 64) / 2;
  page.drawText(stocktext, {
    x: stocktextplace - stocktextwidth / 2,
    y: 736,
    size: 10,
    font: timesRomanFont,
  });
  const notext = "No.";
  const notextwidth = timesRomanFont.widthOfTextAtSize(notext, 10);
  const notextplace = (34 + 64) / 2;
  page.drawText(notext, {
    x: notextplace - notextwidth / 2,
    y: 725,
    size: 10,
    font: timesRomanFont,
  });
  const unittext = "Unit";
  const unittextwidth = timesRomanFont.widthOfTextAtSize(unittext, 10);
  const unittextplace = (64 + 101) / 2;
  page.drawText(unittext, {
    x: unittextplace - unittextwidth / 2,
    y: 730,
    size: 10,
    font: timesRomanFont,
  });
  const desctext = "Description";
  const desctextwidth = timesRomanFont.widthOfTextAtSize(desctext, 10);
  const desctextplace = (101 + 295) / 2;
  page.drawText(desctext, {
    x: desctextplace - desctextwidth / 2,
    y: 730,
    size: 10,
    font: timesRomanFont,
  });
  const quantext = "Quantity";
  const qauntextwidth = timesRomanFont.widthOfTextAtSize(quantext, 10);
  const quantextplace = (295 + 332) / 2;
  page.drawText(quantext, {
    x: quantextplace - qauntextwidth / 2,
    y: 730,
    size: 10,
    font: timesRomanFont,
  });
  const yestext = "Yes";
  const yestextwidth = timesRomanFont.widthOfTextAtSize(yestext, 10);
  const yestextplace = (332 + 366) / 2;
  page.drawText(yestext, {
    x: yestextplace - yestextwidth / 2,
    y: 730,
    size: 10,
    font: timesRomanFont,
  });
  const nottext = "No";
  const nottextwidth = timesRomanFont.widthOfTextAtSize(nottext, 10);
  const nottextplace = (366 + 397) / 2;
  page.drawText(nottext, {
    x: nottextplace - nottextwidth / 2,
    y: 730,
    size: 10,
    font: timesRomanFont,
  });
  const quantext1 = "Quantity";
  const qauntextwidth1 = timesRomanFont.widthOfTextAtSize(quantext1, 10);
  const quantextplace1 = (397 + 471) / 2;
  page.drawText(quantext1, {
    x: quantextplace1 - qauntextwidth1 / 2,
    y: 730,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText("Remarks", {
    x: 505,
    y: 730,
    size: 10,
    font: timesRomanFont,
  });
  const requisitiontext = "Requisition";
  const requisitiontextwidth = timesRomanItalicFontBold.widthOfTextAtSize(
    requisitiontext,
    11
  );
  const requisitiontextplace = (34 + 332) / 2;
  page.drawText(requisitiontext, {
    x: requisitiontextplace - requisitiontextwidth / 2,
    y: 750,
    size: 11,
    font: timesRomanItalicFontBold,
  });
  const issuetext = "Issue";
  const issuetextwidth = timesRomanItalicFontBold.widthOfTextAtSize(
    issuetext,
    11
  );
  const issuetextplace = (397 + 577) / 2;
  page.drawText(issuetext, {
    x: issuetextplace - issuetextwidth / 2,
    y: 750,
    size: 11,
    font: timesRomanItalicFontBold,
  });
  const satext = "Stock Available?";
  const satextwidth = timesRomanItalicFontBold.widthOfTextAtSize(satext, 7);
  const satextplace = (332 + 397) / 2;
  page.drawText(satext, {
    x: satextplace - satextwidth / 2,
    y: 750,
    size: 7,
    font: timesRomanItalicFontBold,
  });
  page.drawText("Purpose:", {
    x: 50,
    y: 250,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Requested by:", {
    x: 103,
    y: 198,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText("Approved by:", {
    x: 298,
    y: 198,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText("Issued by:", {
    x: 369,
    y: 198,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText("Received by:", {
    x: 474,
    y: 198,
    size: 10,
    font: timesBoldFont,
  });
  page.drawText("Signature:", {
    x: 36,
    y: 174,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText("Printed Name:", {
    x: 36,
    y: 156,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText("Designation:", {
    x: 36,
    y: 139,
    size: 10,
    font: timesRomanFont,
  });
  page.drawText("Date:", { x: 36, y: 120, size: 10, font: timesRomanFont });
  //Horizontal Line

  page.drawLine({
    start: { x: 34, y: 794 },
    end: { x: 577, y: 794 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //1st
  page.drawLine({
    start: { x: 34, y: 760 },
    end: { x: 577, y: 760 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //2nd
  page.drawLine({
    start: { x: 34, y: 746 },
    end: { x: 577, y: 746 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //3rd
  page.drawLine({
    start: { x: 34, y: 721 },
    end: { x: 577, y: 721 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //4th

  page.drawLine({
    start: { x: 34, y: 275 },
    end: { x: 577, y: 275 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 266 },
    end: { x: 577, y: 266 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 210 },
    end: { x: 577, y: 210 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 170 },
    end: { x: 577, y: 170 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 152 },
    end: { x: 577, y: 152 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 135 },
    end: { x: 577, y: 135 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 34, y: 116 },
    end: { x: 577, y: 116 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  //Vertical Line
  page.drawLine({
    start: { x: 34, y: 794 },
    end: { x: 34, y: 116 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); // left-side line
  page.drawLine({
    start: { x: 577, y: 794 },
    end: { x: 577, y: 116 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); // right-side line
  page.drawLine({
    start: { x: 366, y: 794 },
    end: { x: 366, y: 760 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 64, y: 746 },
    end: { x: 64, y: 275 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 101, y: 746 },
    end: { x: 101, y: 275 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 295, y: 746 },
    end: { x: 295, y: 275 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 332, y: 760 },
    end: { x: 332, y: 275 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 397, y: 760 },
    end: { x: 397, y: 275 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 366, y: 746 },
    end: { x: 366, y: 275 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 471, y: 746 },
    end: { x: 471, y: 275 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 101, y: 210 },
    end: { x: 101, y: 116 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 295, y: 210 },
    end: { x: 295, y: 116 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 366, y: 210 },
    end: { x: 366, y: 116 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 471, y: 210 },
    end: { x: 471, y: 116 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  const headerjpg = "/header.jpeg";
  const headerjpgBytes = await fetch(headerjpg).then((res) =>
    res.arrayBuffer()
  );
  const headerimage = await pdfDoc.embedJpg(headerjpgBytes);
  page.drawImage(headerimage, { x: 155, y: 860, width: 326, height: 45 });
  const jpgUrl = "/footer.jpeg";
  const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
  const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
  page.drawImage(jpgImage, { x: 65, y: 50, width: 480, height: 25 });
};
