/* eslint-disable @typescript-eslint/no-unused-vars */
import { _itemsDeliveredType } from "@/types/request/purchase-order";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";

type collectedDataType = {
  po_no: string;
  quantity: number;
  unit: string;
  description: string;
  unitCost: number;
  purpose: string;
  receivedfromname: string;
  receivedfromposition: string;
  receivedbyname: string;
  receivedbyposition: string;
}

export const generateICSPDF = async (itemData: _itemsDeliveredType[]) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const Helveticafont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const maxWidth = 160;
  const lineHeight = 12;
  const footerHeight = 258;
  const pageHeight = 792;
  let yPosition = 530;
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

  const firstPurpose =
    itemData[0]?.inspection_details.po_details.pr_details.purpose ?? "";
  const firstPurposeSplit = wrapText(
    firstPurpose,
    purposewidth,
    12
  );
  const firstPurposeHeight = firstPurposeSplit.length * lineHeight;

  const collectedData: collectedDataType[] = [];
  itemData.forEach((data) => {
    const po_no = data.inspection_details.po_details.po_no;
    const quantity = Number(data.item_details.item_quotation_details.item_details.quantity);
    const unit = data.item_details.item_quotation_details.item_details.unit;
    const description =
      data.item_details.item_quotation_details.item_details.item_description;
    const unitCost = Number(data.item_details.item_quotation_details.unit_price);
    const purpose = data.inspection_details.po_details.pr_details.purpose;
    const receivedfromname =
      data.inspection_details.po_details.pr_details.requisitioner_details.name;
    const receivedfromposition =
      data.inspection_details.po_details.pr_details.requisitioner_details
        .designation;
    const receivedbyname = "sample";
    const receivedbyposition = "sample position";
    collectedData.push({
      po_no,
      quantity,
      unit,
      description,
      unitCost,
      purpose,
      receivedfromname,
      receivedfromposition,
      receivedbyname,
      receivedbyposition,
    });
    const wrappedDescription = wrapText(
      description,
      maxWidth,
      9
    );
    const descriptionHeight = wrappedDescription.length * lineHeight;

    const itemHeight = Math.max(descriptionHeight, lineHeight);
    if (yPosition - itemHeight < footerHeight) {
      textandlines(
        pdfDoc,
        page,
        timesBoldFont,
        timesRomanFont,
        timesRomanItalicFont,
        Helveticafont,
        collectedData,
        firstPurposeHeight,
        firstPurposeSplit,
        lineHeight
      );

      page = pdfDoc.addPage([612, pageHeight]);
      pages.push(page);
      yPosition = 530;
      pageIndex++;
    }

    // Calculate total height required for the current item

    const totalamount = quantity * unitCost;
    const unittext = unit || "";
    const unitwidth = timesRomanFont.widthOfTextAtSize(unittext, 11);
    const unitplace = (88 + 125) / 2;
    page.drawText(unittext, {
      x: unitplace - unitwidth / 2,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    wrappedDescription.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: 255,
        y: yPosition - lineIndex * lineHeight,
        size: 9,
        font: Helveticafont,
      });
    });

    const quantitytext = quantity || "";
    const quantitywidth = timesRomanFont.widthOfTextAtSize(
      quantitytext.toString(),
      10
    );
    const quantityplace = (37 + 88) / 2;
    page.drawText(quantitytext.toString(), {
      x: quantityplace - quantitywidth / 2,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    const unitCostFormatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(unitCost || 0);
    const unitCostWidth = timesRomanFont.widthOfTextAtSize(
      unitCostFormatted,
      10
    );
    const unitCostPlace = 180;
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
    const totalCostPlace = 248;
    page.drawText(totalCostFormatted, {
      x: totalCostPlace - totalCostWidth,
      y: yPosition,
      size: 10,
      font: timesRomanFont,
    });
    yPosition -= itemHeight + 5;
  });

  await textandlines(
    pdfDoc,
    page,
    timesBoldFont,
    timesRomanFont,
    timesRomanItalicFont,
    Helveticafont,
    collectedData,
    firstPurposeHeight,
    firstPurposeSplit,
    lineHeight
  );

  // Serialize the PDF to bytes
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
  Helveticafont: PDFFont,
  collectedData: collectedDataType[],
  firstPurposeHeight: number,
  firstPurposeSplit: string[],
  lineHeight: number
) => {
  collectedData.forEach((data) => {
    //receiveby from
    const receivefrom = (data.receivedfromname || "").toUpperCase();
    const receivefromwidth = timesBoldFont.widthOfTextAtSize(receivefrom, 11);
    const receivefromplace = (37 + 337) / 2;
    page.drawText(receivefrom, {
      x: receivefromplace - receivefromwidth / 2,
      y: 218,
      size: 11,
      font: timesBoldFont,
    });
    const underlineStartX = receivefromplace - receivefromwidth / 2;
    const underlineEndX = receivefromplace + receivefromwidth / 2;
    const underlineY = 216; // Slightly below the text position
    page.drawLine({
      start: { x: underlineStartX, y: underlineY },
      end: { x: underlineEndX, y: underlineY },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });
    const receivefrom1 = data.receivedfromposition || "";
    const receivefrom1width = timesBoldFont.widthOfTextAtSize(receivefrom1, 11);
    const receivefrom1byplace = (37 + 337) / 2;
    page.drawText(receivefrom1, {
      x: receivefrom1byplace - receivefrom1width / 2,
      y: 185,
      size: 11,
      font: timesBoldFont,
    });
    const approvedbyStartX = receivefrom1byplace - receivefrom1width / 2; // Start position of the underline
    const approvedbyEndX = receivefrom1byplace + receivefrom1width / 2; // End position of the underline
    page.drawLine({
      start: { x: approvedbyStartX, y: 183 },
      end: { x: approvedbyEndX, y: 183 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });
    //receive by
    const receiveby = (data.receivedbyname || "").toUpperCase();
    const receivebywidth = timesBoldFont.widthOfTextAtSize(receiveby, 11);
    const receivebyplace = (337 + 570) / 2;
    page.drawText(receiveby, {
      x: receivebyplace - receivebywidth / 2,
      y: 218,
      size: 11,
      font: timesBoldFont,
    });
    const rebyStartX = receivebyplace - receivebywidth / 2; // Start position of the underline
    const rebyEndX = receivebyplace + receivebywidth / 2; // End position of the underline
    page.drawLine({
      start: { x: rebyStartX, y: underlineY },
      end: { x: rebyEndX, y: underlineY },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    const receiveby1 = data.receivedbyposition || "";
    const receiveby1width = timesBoldFont.widthOfTextAtSize(receiveby1, 11);
    const receiveby1place = (337 + 570) / 2;
    page.drawText(receiveby1, {
      x: receiveby1place - receiveby1width / 2,
      y: 185,
      size: 11,
      font: timesBoldFont,
    });
    const receiveby1StartX = receiveby1place - receiveby1width / 2; // Start position of the underline
    const receiveby1EndX = receiveby1place + receiveby1width / 2; // End position of the underline
    page.drawLine({
      start: { x: receiveby1StartX, y: 183 },
      end: { x: receiveby1EndX, y: 183 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });
    //date
    const dater = "asdasd";
    const daterwidth = timesBoldFont.widthOfTextAtSize(dater, 11);
    const daterby1place = (37 + 337) / 2;
    page.drawText(dater, {
      x: daterby1place - daterwidth / 2,
      y: 152,
      size: 11,
      font: timesBoldFont,
    });
    const dater1 = "asdasd";
    const dater1width = timesBoldFont.widthOfTextAtSize(dater1, 11);
    const dater1by1place = (337 + 570) / 2;
    page.drawText(dater1, {
      x: dater1by1place - dater1width / 2,
      y: 152,
      size: 11,
      font: timesBoldFont,
    });
    page.drawText(data.po_no, {
      x: 127,
      y: 134 - firstPurposeHeight - 5,
      size: 9,
      font: Helveticafont,
    }); //PO number
  });
  page.drawText("PO #:", {
    x: 99,
    y: 134 - firstPurposeHeight - 5,
    size: 10,
    font: Helveticafont,
  });
  page.drawText("INVENTORY CUSTODIAN SLIP", {
    x: 201,
    y: 645,
    size: 14,
    font: timesBoldFont,
  });
  page.drawText("Appendix 59", {
    x: 490,
    y: 760,
    size: 9,
    font: timesRomanItalicFont,
  });
  page.drawText("Entity Name:", {
    x: 40,
    y: 620,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("CTU - ARGAO CAMPUS", {
    x: 108,
    y: 620,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 108, y: 618 },
    end: { x: 226, y: 618 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  firstPurposeSplit.forEach((line, lineIndex) => {
    page.drawText(line, {
      x: 128,
      y: 129 - lineIndex * lineHeight,
      size: 9,
      font: timesRomanFont,
    });
  });

  // Horizontal and vertical lines.
  //Horizontal Line

  page.drawLine({
    start: { x: 37, y: 595 },
    end: { x: 570, y: 595 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 37, y: 544 },
    end: { x: 570, y: 544 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 37, y: 139 },
    end: { x: 570, y: 139 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 37, y: 255 },
    end: { x: 570, y: 255 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 125, y: 575 },
    end: { x: 252, y: 575 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });
  // Add Fund Cluster label and editable field
  page.drawText("Fund Cluster:", {
    x: 40,
    y: 603,
    size: 11,
    font: timesBoldFont,
  });
  page.drawLine({
    start: { x: 110, y: 602 },
    end: { x: 310, y: 602 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  page.drawText("ICS No.:", { x: 422, y: 603, size: 11, font: timesBoldFont });
  page.drawLine({
    start: { x: 468, y: 602 },
    end: { x: 555, y: 602 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  const quant = "Quantity";
  const quantwidth = timesBoldFont.widthOfTextAtSize(quant, 11);
  const quantplace = (37 + 88) / 2;
  page.drawText(quant, {
    x: quantplace - quantwidth / 2,
    y: 565,
    size: 11,
    font: timesBoldFont,
  });
  const un = "Unit";
  const unwidth = timesBoldFont.widthOfTextAtSize(un, 12);
  const unplace = (88 + 125) / 2;
  page.drawText(un, {
    x: unplace - unwidth / 2,
    y: 565,
    size: 11,
    font: timesBoldFont,
  });
  const amo = "Amount";
  const amowidth = timesBoldFont.widthOfTextAtSize(amo, 11);
  const amoplace = (125 + 252) / 2;
  page.drawText(amo, {
    x: amoplace - amowidth / 2,
    y: 583,
    size: 11,
    font: timesBoldFont,
  });
  const uncost = "Unit Cost";
  const uncostwidth = timesRomanFont.widthOfTextAtSize(uncost, 11);
  const uncostplace = (125 + 184) / 2;
  page.drawText(uncost, {
    x: uncostplace - uncostwidth / 2,
    y: 557,
    size: 11,
    font: timesRomanFont,
  });
  const tocost = "Total Cost";
  const tocosttwidth = timesRomanFont.widthOfTextAtSize(tocost, 11);
  const tocostplace = (184 + 252) / 2;
  page.drawText(tocost, {
    x: tocostplace - tocosttwidth / 2,
    y: 557,
    size: 11,
    font: timesRomanFont,
  });
  const desc = "Description";
  const descwidth = timesRomanFont.widthOfTextAtSize(desc, 11);
  const descplace = (252 + 422) / 2;
  page.drawText(desc, {
    x: descplace - descwidth / 2,
    y: 565,
    size: 11,
    font: timesBoldFont,
  });
  const invent = "Inventory";
  const inventwidth = timesRomanFont.widthOfTextAtSize(invent, 11);
  const inventplace = (422 + 493) / 2;
  page.drawText(invent, {
    x: inventplace - inventwidth / 2,
    y: 575,
    size: 11,
    font: timesBoldFont,
  });
  const itemno = "Item No.";
  const itemnotwidth = timesRomanFont.widthOfTextAtSize(itemno, 11);
  const itemnoplace = (422 + 493) / 2;
  page.drawText(itemno, {
    x: itemnoplace - itemnotwidth / 2,
    y: 560,
    size: 11,
    font: timesBoldFont,
  });
  const esti = "Estimated";
  const estwidth = timesRomanFont.widthOfTextAtSize(esti, 11);
  const estplace = (493 + 570) / 2;
  page.drawText(esti, {
    x: estplace - estwidth / 2,
    y: 575,
    size: 11,
    font: timesBoldFont,
  });
  const uselife = "Useful Life";
  const uselifewidth = timesRomanFont.widthOfTextAtSize(uselife, 11);
  const uselifeplace = (493 + 570) / 2;
  page.drawText(uselife, {
    x: uselifeplace - uselifewidth / 2,
    y: 560,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText(" ", { x: 425, y: 610, size: 11, font: timesBoldFont });
  page.drawText(" ", { x: 495, y: 610, size: 11, font: timesBoldFont });

  page.drawText("Received from:", {
    x: 40,
    y: 243,
    size: 10,
    font: Helveticafont,
  });
  page.drawText("Received by:", {
    x: 340,
    y: 243,
    size: 10,
    font: Helveticafont,
  });
  page.drawText("Purpose:", { x: 85, y: 128, size: 10, font: Helveticafont });

  const text1 = "Signature Over Printed Name";
  const text1width = timesRomanFont.widthOfTextAtSize(text1, 11);
  const text1place = (37 + 337) / 2;
  page.drawText(text1, {
    x: text1place - text1width / 2,
    y: 200,
    size: 11,
    font: timesRomanFont,
  });
  const text2 = "Position/Office";
  const text2width = timesRomanFont.widthOfTextAtSize(text2, 11);
  const text2place = (37 + 337) / 2;
  page.drawText(text2, {
    x: text2place - text2width / 2,
    y: 170,
    size: 11,
    font: timesRomanFont,
  });
  const text3 = "Date";
  const text3width = timesRomanFont.widthOfTextAtSize(text3, 11);
  const text3place = (37 + 337) / 2;
  page.drawText(text3, {
    x: text3place - text3width / 2,
    y: 142,
    size: 11,
    font: timesRomanFont,
  });

  const text4 = "Signature Over Printed Name";
  const text4width = timesRomanFont.widthOfTextAtSize(text4, 11);
  const text4place = (337 + 570) / 2;
  page.drawText(text4, {
    x: text4place - text4width / 2,
    y: 200,
    size: 11,
    font: timesRomanFont,
  });
  const text5 = "Position/Office";
  const text5width = timesRomanFont.widthOfTextAtSize(text5, 11);
  const text5place = (337 + 570) / 2;
  page.drawText(text5, {
    x: text5place - text5width / 2,
    y: 170,
    size: 11,
    font: timesRomanFont,
  });
  const text6 = "Date";
  const text6width = timesRomanFont.widthOfTextAtSize(text6, 11);
  const text6place = (337 + 570) / 2;
  page.drawText(text6, {
    x: text6place - text6width / 2,
    y: 142,
    size: 11,
    font: timesRomanFont,
  });
  page.drawLine({
    start: { x: 37, y: 595 },
    end: { x: 37, y: 139 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); //left
  page.drawLine({
    start: { x: 570, y: 595 },
    end: { x: 570, y: 139 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); // right
  page.drawLine({
    start: { x: 422, y: 595 },
    end: { x: 422, y: 255 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); //5
  page.drawLine({
    start: { x: 337, y: 255 },
    end: { x: 337, y: 139 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); //7
  page.drawLine({
    start: { x: 125, y: 595 },
    end: { x: 125, y: 255 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); //2
  page.drawLine({
    start: { x: 184, y: 575 },
    end: { x: 184, y: 255 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  }); //3
  page.drawLine({
    start: { x: 252, y: 595 },
    end: { x: 252, y: 255 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); //4
  page.drawLine({
    start: { x: 493, y: 595 },
    end: { x: 493, y: 255 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); //6
  page.drawLine({
    start: { x: 88, y: 595 },
    end: { x: 88, y: 255 },
    thickness: 2,
    color: rgb(0, 0, 0),
  }); //1

  const headerjpg = "/header.jpeg";
  const headerjpgBytes = await fetch(headerjpg).then((res) =>
    res.arrayBuffer()
  );
  const headerimage = await pdfDoc.embedJpg(headerjpgBytes);
  page.drawImage(headerimage, { x: 95, y: 668, width: 405, height: 62 });
  const jpgUrl = "/footer.jpeg";
  const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
  const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
  page.drawImage(jpgImage, { x: 45, y: 50, width: 530, height: 30 });
};
