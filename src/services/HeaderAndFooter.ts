import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";

export const HeaderAndFooter = async (
  pdfDoc: PDFDocument,
  page: PDFPage,
  boldFont: PDFFont,
  timesRomanFont: PDFFont,
  footerYPosition: number,
  timesBoldFont: PDFFont
) => {
  // Draw header

  page.drawText("ABSTRACT OF QUOTATIONS", {
    x: 383,
    y: 496.06,
    size: 14,
    font: boldFont,
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
  // Draw footer text near `footerYPosition`

  // Example signature fields at calculated positions
  page.drawText(
    "WE CERTIFY that we opened the bids of the above-listed materials, the abstract of which appears, as the time and date indicated.",
    { x: 56.69, y: footerYPosition, size: 11, font: timesRomanFont }
  );
  page.drawText("Bids and Awards Committee:", {
    x: 31.18,
    y: footerYPosition - 15,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("Conforme:", {
    x: 547.08,
    y: footerYPosition - 15,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("No.", { x: 40, y: 380, size: 11, font: timesBoldFont });
  page.drawText("Items", { x: 200, y: 380, size: 11, font: timesBoldFont });
  page.drawText("Quantity", { x: 375, y: 380, size: 11, font: timesBoldFont });

  page.drawText("Agency", { x: 435.07, y: 387, size: 11, font: timesBoldFont });
  page.drawText("Price", { x: 440, y: 375, size: 11, font: timesBoldFont });

  page.drawText("WINNING BIDDER", {
    x: 578,
    y: 380,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("WINNING PRICE  ", {
    x: 795,
    y: 380,
    size: 11,
    font: timesBoldFont,
  });

  //text signature
  page.drawText("RYAN H. TEO, MPA", {
    x: 80.39,
    y: footerYPosition - 57.15,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Member", {
    x: 96.92,
    y: footerYPosition - 72.32,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("LEMUEL M. VELASCO, Dev.Ed.D", {
    x: 334.72,
    y: footerYPosition - 57.15,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Member", {
    x: 381.93,
    y: footerYPosition - 72.32,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("End-user", {
    x: 726.77,
    y: footerYPosition - 72.32,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("JUNE REY A. VILLEGAS", {
    x: 68.57,
    y: footerYPosition - 140.07,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Member", {
    x: 96.92,
    y: footerYPosition - 155.2,
    size: 11,
    font: timesRomanFont,
  });
  page.drawText("CHARISSA JANE S. SAMBOLA, CPA", {
    x: 331.46,
    y: footerYPosition - 140.07,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Vice-Chairman", {
    x: 371.14,
    y: footerYPosition - 155.2,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("LEVI U. PANGAN, LPT", {
    x: 200,
    y: footerYPosition - 97.32,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("BAC Chairman", {
    x: 225.14,
    y: footerYPosition - 113.07,
    size: 11,
    font: timesRomanFont,
  });

  page.drawText("EINGILBERT C. BENOLIRAO, Dev.Ed.D.", {
    x: 658.44,
    y: footerYPosition - 140.07,
    size: 11,
    font: timesBoldFont,
  });
  page.drawText("Campus Director / Head of Procuring Entity", {
    x: 665,
    y: footerYPosition - 155.2,
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
    start: { x: 29.53, y: 368.57 },
    end: { x: 898.98, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  //logos
  const pngUrl = "/Footer.png";
  const pngImageBytes = await fetch(pngUrl).then((res) => res.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(pngImageBytes)
  const pngDims = pngImage.scale(0.7);

  page.drawImage(pngImage, {
    x: 240,
    y: 20,
    width: pngDims.width,
    height: pngDims.height,
  });
  //Vertical Line
  page.drawLine({
    start: { x: 29.53, y: 401.57 },
    end: { x: 29.53, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 64.96, y: 401.57 },
    end: { x: 64.96, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 366.14, y: 401.57 },
    end: { x: 366.14, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 425.2, y: 401.57 },
    end: { x: 425.2, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 480.31, y: 401.57 },
    end: { x: 480.31, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 780.38, y: 401.57 },
    end: { x: 780.38, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 898.5, y: 401.57 },
    end: { x: 898.5, y: 368.57 },
    thickness: 1.5,
    color: rgb(0, 0, 0),
  });

  // Additional footer elements as needed...
};
