const PDFDocument = require("pdfkit");

function formatCurrency(n) {
  return n != null ? n.toFixed(2) : "0.00";
}

module.exports = function generateInvoicePDF(invoice, res) {
  const doc = new PDFDocument({ size: "A4", margin: 30 });
  doc.font("Helvetica");

  // Pipe PDF output to response
  doc.pipe(res);

  // Header with company info
  doc.fontSize(24).fillColor("#1f2937").text("Om Communication", 30, 30);
  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text("Thana road Laxmipur, Jamui, Bihar, 811312", 30, 60)
    .text("Mobile: +91 75438 66809 | Email: ", 30, 75)
    .text("GST No: ", 30, 90);

  // Invoice title and number
  doc
    .fontSize(18)
    .fillColor("#1f2937")
    .text("INVOICE", 400, 30, { align: "right" });
  doc
    .fontSize(12)
    .fillColor("#374151")
    .text(`Invoice No: ${invoice.invoiceNumber}`, 400, 55, { align: "right" })
    .text(
      `Date: ${new Date(invoice.date).toLocaleDateString("en-IN")}`,
      400,
      75,
      { align: "right" },
    );

  // Horizontal line
  doc
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .moveTo(30, 120)
    .lineTo(565, 120)
    .stroke();

  // Customer details
  doc.fontSize(12).fillColor("#1f2937").text("Bill To:", 30, 140);
  doc
    .fontSize(11)
    .fillColor("#374151")
    .font("Helvetica-Bold")
    .text(invoice.customerName, 30, 160)
    .font("Helvetica")
    .text(`Mobile: +91 ${invoice.mobileNumber}`, 30, 175);

  if (invoice.address) {
    doc.text(`Address: ${invoice.address}`, 30, 190, { width: 300 });
  }

  // Items table
  const tableTop = 230;
  const itemX = 30;
  const colWidths = {
    sr: 30,
    itemName: 180,
    serial: 110,
    qty: 45,
    price: 70,
    total: 70,
  };

  // Table header background
  doc
    .rect(itemX, tableTop - 5, 535, 25)
    .fillColor("#f3f4f6")
    .fill();

  // Table headers
  doc.fontSize(10).fillColor("#374151");
  let currentX = itemX;
  doc.text("Sr.", currentX + 5, tableTop + 5, {
    width: colWidths.sr,
    align: "center",
  });
  currentX += colWidths.sr;
  doc.text("Item Name", currentX + 5, tableTop + 5, {
    width: colWidths.itemName,
  });
  currentX += colWidths.itemName;
  doc.text("Product/Serial No", currentX + 5, tableTop + 5, {
    width: colWidths.serial,
  });
  currentX += colWidths.serial;
  doc.text("Qty", currentX + 5, tableTop + 5, {
    width: colWidths.qty,
    align: "center",
  });
  currentX += colWidths.qty;
  doc.text("Price", currentX + 5, tableTop + 5, {
    width: colWidths.price,
    align: "right",
  });
  currentX += colWidths.price;
  doc.text("Total", currentX + 5, tableTop + 5, {
    width: colWidths.total,
    align: "right",
  });

  // Table border
  doc
    .strokeColor("#d1d5db")
    .lineWidth(0.5)
    .rect(itemX, tableTop - 5, 535, 25)
    .stroke();

  // Table rows
  let currentY = tableTop + 25;
  invoice.items.forEach((item, idx) => {
    if (idx % 2 === 1) {
      doc
        .rect(itemX, currentY - 2, 535, 20)
        .fillColor("#f9fafb")
        .fill();
    }

    doc.fontSize(9).fillColor("#374151");
    currentX = itemX;

    doc.text(String(idx + 1), currentX + 5, currentY + 3, {
      width: colWidths.sr,
      align: "center",
    });
    currentX += colWidths.sr;
    doc.text(item.itemName || "", currentX + 5, currentY + 3, {
      width: colWidths.itemName - 10,
    });
    currentX += colWidths.itemName;
    doc.text(item.productSerialNo || "", currentX + 5, currentY + 3, {
      width: colWidths.serial - 10,
    });
    currentX += colWidths.serial;
    doc.text(String(item.quantity), currentX + 5, currentY + 3, {
      width: colWidths.qty,
      align: "center",
    });
    currentX += colWidths.qty;
    doc.text(
      `${formatCurrency(item.pricePerUnit)}`,
      currentX + 5,
      currentY + 3,
      { width: colWidths.price - 5, align: "right" },
    );
    currentX += colWidths.price;
    doc.text(`${formatCurrency(item.total)}`, currentX + 5, currentY + 3, {
      width: colWidths.total - 5,
      align: "right",
    });

    // Row border
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(0.3)
      .rect(itemX, currentY - 2, 535, 20)
      .stroke();

    currentY += 20;
  });

  // Grand total section
  const totalY = currentY + 20;
  doc
    .rect(itemX + 345, totalY, 200, 30)
    .fillColor("#1f2937")
    .fill();
  doc
    .fontSize(14)
    .fillColor("#ffffff")
    .text(
      `Grand Total: ${formatCurrency(invoice.grandTotal)}`,
      itemX + 355,
      totalY + 8,
      { width: 180, align: "center" },
    );

  // Footer
  const footerY = totalY + 80;
  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text("Terms & Conditions:", 50, footerY)
    .text("• Payment due within 30 days", 50, footerY + 15)
    .text("• Goods once sold will not be taken back", 50, footerY + 30);

  doc.text("Authorized Signature", 400, footerY + 30, { align: "right" });
  doc.text("Om Communication", 400, footerY + 50, { align: "right" });

  // Footer line
  doc
    .strokeColor("#e5e7eb")
    .lineWidth(0.5)
    .moveTo(30, 750)
    .lineTo(565, 750)
    .stroke();

  doc
    .fontSize(8)
    .fillColor("#9ca3af")
    .text("Thank you for your business!", 30, 760, {
      align: "center",
      width: 535,
    });

  doc.end();
};
