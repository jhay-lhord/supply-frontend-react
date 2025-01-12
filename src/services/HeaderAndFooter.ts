import { BACmemberType } from "@/types/request/BACmember";
import { supplierItemType_ } from "@/types/response/abstract-of-quotation";
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";

export const HeaderAndFooter = async (  
  pdfDoc: PDFDocument,
  page: PDFPage,
  boldFont: PDFFont,
  timesRomanFont: PDFFont,
  footerYPosition: number,
  timesBoldFont: PDFFont,
  bac_members: BACmemberType[],
  data: supplierItemType_
) => {
    // Draw header
 
    page.drawText('ABSTRACT OF QUOTATIONS', { x: 379, y: 496.06, size: 12, font: boldFont });
    page.drawText('Project Name:', {x: 194.49, y: 473.19, size: 11, font: timesRomanFont });
    page.drawText('Date of Posting:', {x: 186.61, y: 456.38, size: 11, font: timesRomanFont });
    page.drawText('Project Location:', {x: 182, y: 442.91, size: 11, font: timesRomanFont });
    page.drawText('Implementing Office:', {x: 162.50, y: 428, size: 11, font: timesRomanFont });
    page.drawText('Approved Budget:', {x: 176.70, y: 413, size: 11, font: timesRomanFont });
    page.drawText('# of Sheets:', {x: 644.29, y: 473.19, size: 11, font: timesRomanFont });
    page.drawText('Award Resolution No.:', {x: 594, y: 456.38, size: 11, font: timesRomanFont });
    page.drawText('Date and Time:', {x: 627.70, y: 442.91, size: 11, font: timesRomanFont });
    page.drawText('Mode of Procurement:', {x: 597, y: 428, size: 11, font: timesRomanFont });
    page.drawText('PR/Control No.:', {x: 624, y: 413, size: 11, font: timesRomanFont });
    // Draw footer text near footerYPosition
   

    // Example signature fields at calculated positions
    page.drawText('WE CERTIFY that we opened the bids of the above-listed materials, the abstract of which appears, as the time and date indicated.', {x: 56.69, y: footerYPosition, size: 12, font: timesRomanFont });
    page.drawText('Bids and Awards Committee:', {x: 31.18, y: footerYPosition - 15, size: 12, font: timesRomanFont });
    page.drawText('Conforme:', {x: 547.08, y: footerYPosition - 15, size: 11, font: timesRomanFont });
    page.drawText('No.', {x: 40, y: 380, size: 11, font: timesBoldFont });
    page.drawText('Items', {x: 200, y: 380, size: 11, font: timesBoldFont });
    page.drawText('Quantity', {x: 365, y: 380, size: 11, font: timesBoldFont });
  
    page.drawText('Agency', {x: 428.07, y: 387, size: 11, font: timesBoldFont });
    page.drawText('Price', {x: 433, y: 375, size: 11, font: timesBoldFont });
  
    page.drawText('WINNING BIDDER', {x: 578, y: 380, size: 11, font: timesBoldFont });
    page.drawText('WINNING PRICE  ', {x: 795, y: 380, size: 11, font: timesBoldFont });
  
  
    //text signature
    page.drawText(bac_members[0].name, {x: 80.39, y: footerYPosition - 57.15, size: 11, font: timesBoldFont });
    page.drawText(bac_members[0].designation, {x: 96.92, y: footerYPosition - 72.32, size: 11, font: timesRomanFont });
    page.drawText(bac_members[1].name, {x: 334.72, y: footerYPosition - 57.15, size: 11, font: timesBoldFont });
    page.drawText(bac_members[1].designation, {x: 381.93, y: footerYPosition - 72.32, size: 11, font: timesRomanFont });
  
    page.drawText('End-user', {x: 726.77, y: footerYPosition - 72.32 , size: 11, font: timesRomanFont });
  
    page.drawText(bac_members[2].name, {x: 68.57, y: footerYPosition - 130.07, size: 11, font: timesBoldFont });
    page.drawText(bac_members[2].designation, {x: 96.92, y: footerYPosition - 145.2 , size: 11, font: timesRomanFont });
    page.drawText(bac_members[3].name, {x: 331.46, y: footerYPosition - 130.07, size: 11, font: timesBoldFont });
    page.drawText(bac_members[3].designation, {x: 371.14, y: footerYPosition - 140.2  , size: 11, font: timesRomanFont });
  
    page.drawText(bac_members[4].name, {x: 200, y:  footerYPosition - 91.32, size: 11, font: timesBoldFont });
    page.drawText(bac_members[4].designation, {x: 225.14, y:  footerYPosition - 105.07   , size: 11, font: timesRomanFont });
  
    page.drawText(data.supplier_details.aoq_details.pr_details.campus_director_details.name, {x: 658.44, y: footerYPosition - 130.07, size: 11, font: timesBoldFont });
    page.drawText(data.supplier_details.aoq_details.pr_details.campus_director_details.designation, {x: 665, y:  footerYPosition - 140.2 , size: 11, font: timesRomanFont });
     //Horizontal Line
     page.drawLine({start: { x: 29.53  , y: 401.57 }, end: { x: 898.98, y: 401.57 }, thickness: 1.5 , color: rgb(0, 0, 0)});
     page.drawLine({start: { x: 29.53  , y: 368.57 }, end: { x: 898.98, y: 368.57 }, thickness: 1.5 , color: rgb(0, 0, 0)});  
     //logos
     const headerjpg = '/header.jpeg';
     const headerjpgBytes = await fetch(headerjpg).then((res) => res.arrayBuffer());
     const headerimage = await pdfDoc.embedJpg(headerjpgBytes);
     page.drawImage(headerimage, {
         x: 235,
         y: 510,
         width: 462,
         height: 85,
     });
     page.drawText('Republic of the Philippines', { x: 391, y: 580, size: 12, font: timesRomanFont });
     page.drawText('CEBU TECHNOLOGICAL UNIVERSITY', { x: 348, y: 565, size: 12, font: boldFont });
     page.drawText('ARGAO CAMPUS', { x: 411, y: 553, size: 12, font: timesRomanFont });
     page.drawText('Ed Kintanar Street, Lamacan, Argao Cebu Philippines', { x: 348, y: 543, size: 10, font: timesRomanFont });
     page.drawText('Website:', { x: 348, y: 533, size: 8, font: timesRomanFont});
     page.drawText('http://www.argao.ctu.edu.ph ', { x: 380, y: 533, size: 8, font: timesRomanFont, color: rgb(0, 0, 1)});
     page.drawText('E-mail: cdargao@ctu.edu.ph', { x: 483, y: 533, size: 8, font: timesRomanFont});
     page.drawText('Phone No.: (032) 485-8290/485-5109 loc 1700Fax. N0.: (032)4858-290', { x: 343, y: 523, size: 8, font: timesRomanFont });
    
     const jpgUrl = '/footer.jpeg';
     const jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
     const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
     const jpgDims = jpgImage.scale(0.3);
 
     page.drawImage(jpgImage, {
         x: 240,
         y: 10,
         width: jpgDims.width,
         height: jpgDims.height,
     });
      //Vertical Line
    page.drawLine({start: { x: 29.53 , y:401.57  }, end: { x: 29.53 , y:  368.57 }, thickness: 1.5 , color: rgb(0, 0, 0)});
    page.drawLine({start: { x: 64.96 , y:401.57  }, end: { x: 64.96 , y:  368.57 }, thickness: 1.5 , color: rgb(0, 0, 0)});
    page.drawLine({start: { x: 356.14 , y:401.57 }, end: { x: 356.14 , y:  368.57  }, thickness: 1.5 , color: rgb(0, 0, 0)});
    page.drawLine({start: { x: 415.20 , y:401.57  }, end: { x: 415.20 , y: 368.57 }, thickness: 1.5 , color: rgb(0, 0, 0)});
    page.drawLine({start: { x: 480.31 , y:401.57  }, end: { x: 480.31 , y:  368.57 }, thickness: 1.5 , color: rgb(0, 0, 0)});
    page.drawLine({start: { x: 780.38 , y:401.57  }, end: { x: 780.38 , y:  368.57}, thickness: 1.5 , color: rgb(0, 0, 0)});
    page.drawLine({start: { x: 898.50, y:401.57  }, end: { x: 898.50 , y:  368.57  }, thickness: 1.5 , color: rgb(0, 0, 0)});
    
   
};
