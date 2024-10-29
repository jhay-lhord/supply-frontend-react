import React, { useState } from 'react';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
const EditablePDFPreview = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const generateEditablePDF = async () => {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // 8.5 inches x 11 inches in points

    // Embed the standard Times Roman font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanItalicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Add title and other elements to the PDF
    page.drawText('PURCHASE REQUEST', { x: 201, y: 725, size: 14, font: timesBoldFont });
    page.drawText('Appendix 60', { x: 490, y: 760, size: 14, font: timesRomanItalicFont });
    page.drawText('Entity Name:', { x: 23, y: 697, size: 11, font: timesBoldFont });
    page.drawText('CTU - ARGAO CAMPUS', { x: 96, y: 697, size: 11, font: timesRomanFont });

    // Horizontal and vertical lines are drawn here...
//Horizontal Line
  
page.drawLine({start: { x: 22, y: 680 }, end: { x: 564, y: 680 }, thickness: 2, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 22.68, y: 635 }, end: { x: 564, y: 635 }, thickness: 1, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 22.68, y: 590 }, end: { x: 564, y: 590 }, thickness: 1, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 22.68, y: 43 }, end: { x: 564, y: 43 }, thickness: 2, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 22.68, y: 102 }, end: { x: 564, y: 102 }, thickness: 1, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 22.68, y: 150 }, end: { x: 564, y: 150 }, thickness: 1, color: rgb(0, 0, 0)});

// Add Fund Cluster label and editable field
page.drawText('Fund Cluster:', { x: 369, y: 697, size: 11, font: timesBoldFont });

page.drawText('', { x: 130, y: 669, size: 11, font: timesRomanFont });
page.drawLine({
  start: { x: 445, y: 695 }, // Starting point of the line
  end: { x:520, y: 695 },   // Ending point of the line (same y value)
  thickness: 1,              // Line thickness
  color: rgb(0, 0, 0),       // Black color
});
page.drawText('Office/Section:', { x: 30, y: 663, size: 11, font: timesBoldFont });
page.drawText('PR No.:', { x: 125, y: 663, size: 11, font: timesBoldFont });
page.drawText('Responsibility Center Code :', { x: 125, y: 645, size: 11, font: timesBoldFont });
page.drawText('Date :', { x: 418, y: 663, size: 11, font: timesBoldFont });
page.drawText('Stock/', { x: 30, y: 620, size: 11, font: timesBoldFont });
page.drawText('Property', { x: 25, y: 609, size: 11, font: timesBoldFont });
page.drawText('No.', { x: 35, y: 595, size: 11, font: timesBoldFont });
page.drawText('Unit', { x: 80, y: 610, size: 11, font: timesBoldFont });
page.drawText('Item Description', { x: 206, y: 610, size: 11, font: timesBoldFont });
page.drawText('Quantity', { x: 370, y: 610, size: 11, font: timesBoldFont });
page.drawText('Unit Cost', { x: 425, y: 610, size: 11, font: timesBoldFont });
page.drawText('Total Cost', { x: 495, y: 610, size: 11, font: timesBoldFont });
page.drawText('Purpose:', { x: 53, y: 138, size: 12, font: timesBoldFont });
page.drawText('Requested by:', { x: 125, y: 92, size: 12, font: timesBoldFont });
page.drawText('Signature:', { x: 26, y: 80, size: 12, font: timesBoldFont });
page.drawText('Printed Name:', { x: 26, y: 65, size: 12, font: timesBoldFont });
page.drawText('Designation:', { x: 26, y: 50, size: 12, font: timesBoldFont });
page.drawText('Approved by:', { x: 367, y: 92, size: 12, font: timesBoldFont });
//Vertical Lines
page.drawLine({start: { x: 22.68, y: 680 }, end: { x: 22.68, y: 43 }, thickness: 2, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 564, y: 680 }, end: { x:564, y: 43 }, thickness: 2, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 416, y: 680 }, end: { x: 416, y: 150 }, thickness: 2, color: rgb(0, 0, 0)}); 
page.drawLine({start: { x: 119, y: 680 }, end: { x:119, y: 150 }, thickness: 2, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 70, y: 635 }, end: { x: 65, y: 150 }, thickness: 1, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 480, y: 635 }, end: { x: 480, y: 150 }, thickness: 1, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 365, y: 635 }, end: { x: 365, y: 150 }, thickness: 1, color: rgb(0, 0, 0)});
page.drawLine({start: { x: 365, y: 102 }, end: { x: 365, y: 43 }, thickness: 1, color: rgb(0, 0, 0)});


    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfBlobUrl = URL.createObjectURL(blob);

    // Set the PDF URL to preview it
    setPdfUrl(pdfBlobUrl);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Editable PDF Preview</h1>

      {/* Button to generate and preview the PDF */}
      <button
        onClick={generateEditablePDF}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Preview Editable PDF
      </button>

      {/* Display PDF preview in iframe */}
      {pdfUrl && (
        <div className="mt-4">
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="1000"
            height="1050"
            className="border border-gray-300"
          ></iframe>

          {/* Download button */}
          <div className="mt-4">
            <a
              href={pdfUrl}
              download="editable_form.pdf"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditablePDFPreview;
