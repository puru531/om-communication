const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

function formatCurrency(n) {
  return n != null ? n.toFixed(2) : "0.00";
}

const STAMP_PATH = path.join(__dirname, "../assets/stamp_and_signature.png");

module.exports = function generateInvoicePDF(invoice, res) {
  const doc = new PDFDocument({ size: "A4", margin: 30 });
  doc.font("Helvetica");
  doc.pipe(res);

  // Header
  doc.fontSize(24).fillColor("#1f2937").text("Om Communication", 30, 30);
  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text("Thana road Laxmipur, Jamui, Bihar, 811312", 30, 60)
    .text("Mobile: +91 75438 66809 | Email: ", 30, 75)
    .text("GST No: 10FZXPL9841L1ZJ", 30, 90);

  doc.fontSize(18).fillColor("#1f2937").text("INVOICE", 400, 30, { align: "right" });
  doc
    .fontSize(12)
    .fillColor("#374151")
    .text(`Invoice No: ${invoice.invoiceNumber}`, 400, 55, { align: "right" })
    .text(`Date: ${new Date(invoice.date).toLocaleDateString("en-IN")}`, 400, 75, { align: "right" });

  doc.strokeColor("#e5e7eb").lineWidth(1).moveTo(30, 120).lineTo(565, 120).stroke();

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

  // Mobile device details section
  let tableTop = 230;
  if (invoice.isMobileInvoice && invoice.mobileDetails) {
    const md = invoice.mobileDetails;
    doc.fontSize(11).fillColor("#1f2937").font("Helvetica-Bold").text("Mobile Device Details:", 30, 215);
    doc.font("Helvetica").fontSize(10).fillColor("#374151");

    const leftFields = [
      ["Model No.", md.modelNo],
      ["IMEI No. 1", md.imei1],
      ["IMEI No. 2", md.imei2],
    ];
    const rightFields = [
      ["S/N No.", md.snNo],
      ["Battery No.", md.batteryNo],
      ["Charger No.", md.chargerNo],
      ["Color", md.color],
    ];

    let detailY = 232;
    leftFields.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").text(`${label}: `, 30, detailY, { continued: true });
      doc.font("Helvetica").text(value || "-");
      detailY += 15;
    });

    detailY = 232;
    rightFields.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").text(`${label}: `, 300, detailY, { continued: true });
      doc.font("Helvetica").text(value || "-");
      detailY += 15;
    });

    tableTop = 300;
    doc.strokeColor("#e5e7eb").lineWidth(0.5).moveTo(30, tableTop - 10).lineTo(565, tableTop - 10).stroke();
  }

  // Items table
  const itemX = 30;
  const colWidths = { sr: 30, itemName: 180, serial: 110, qty: 45, price: 70, total: 70 };

  doc.rect(itemX, tableTop - 5, 535, 25).fillColor("#f3f4f6").fill();
  doc.fontSize(10).fillColor("#374151");

  let currentX = itemX;
  doc.text("Sr.", currentX + 5, tableTop + 5, { width: colWidths.sr, align: "center" });
  currentX += colWidths.sr;
  doc.text("Item Name", currentX + 5, tableTop + 5, { width: colWidths.itemName });
  currentX += colWidths.itemName;
  doc.text("Product/Serial No", currentX + 5, tableTop + 5, { width: colWidths.serial });
  currentX += colWidths.serial;
  doc.text("Qty", currentX + 5, tableTop + 5, { width: colWidths.qty, align: "center" });
  currentX += colWidths.qty;
  doc.text("Price", currentX + 5, tableTop + 5, { width: colWidths.price, align: "right" });
  currentX += colWidths.price;
  doc.text("Total", currentX + 5, tableTop + 5, { width: colWidths.total, align: "right" });

  doc.strokeColor("#d1d5db").lineWidth(0.5).rect(itemX, tableTop - 5, 535, 25).stroke();

  let currentY = tableTop + 25;
  invoice.items.forEach((item, idx) => {
    if (idx % 2 === 1) {
      doc.rect(itemX, currentY - 2, 535, 20).fillColor("#f9fafb").fill();
    }
    doc.fontSize(9).fillColor("#374151");
    currentX = itemX;
    doc.text(String(idx + 1), currentX + 5, currentY + 3, { width: colWidths.sr, align: "center" });
    currentX += colWidths.sr;
    doc.text(item.itemName || "", currentX + 5, currentY + 3, { width: colWidths.itemName - 10 });
    currentX += colWidths.itemName;
    doc.text(item.productSerialNo || "", currentX + 5, currentY + 3, { width: colWidths.serial - 10 });
    currentX += colWidths.serial;
    doc.text(String(item.quantity), currentX + 5, currentY + 3, { width: colWidths.qty, align: "center" });
    currentX += colWidths.qty;
    doc.text(`${formatCurrency(item.pricePerUnit)}`, currentX + 5, currentY + 3, { width: colWidths.price - 5, align: "right" });
    currentX += colWidths.price;
    doc.text(`${formatCurrency(item.total)}`, currentX + 5, currentY + 3, { width: colWidths.total - 5, align: "right" });
    doc.strokeColor("#e5e7eb").lineWidth(0.3).rect(itemX, currentY - 2, 535, 20).stroke();
    currentY += 20;
  });

  // Grand total
  const totalY = currentY + 20;
  doc.rect(itemX + 345, totalY, 200, 30).fillColor("#1f2937").fill();
  doc
    .fontSize(14)
    .fillColor("#ffffff")
    .text(`Grand Total: ${formatCurrency(invoice.grandTotal)}`, itemX + 355, totalY + 8, { width: 180, align: "center" });

  // Signatures row
  const sigY = totalY + 60;

  // Customer signature (left)
  doc.strokeColor("#9ca3af").lineWidth(0.5).moveTo(30, sigY + 30).lineTo(200, sigY + 30).stroke();
  doc.fontSize(9).fillColor("#6b7280").text("Customer's Signature", 30, sigY + 35, { width: 170, align: "center" });

  // Seller stamp + signature (right)
  const stampX = 370;
  const stampW = 160;
  const stampH = 60;
  if (fs.existsSync(STAMP_PATH)) {
    doc.image(STAMP_PATH, stampX, sigY - 20, { width: stampW, height: stampH });
  }
  doc.strokeColor("#9ca3af").lineWidth(0.5).moveTo(stampX, sigY + 30).lineTo(stampX + stampW, sigY + 30).stroke();
  doc.fontSize(9).fillColor("#6b7280").text("Authorized Signature", stampX, sigY + 35, { width: stampW, align: "center" });
  doc.text("Om Communication", stampX, sigY + 47, { width: stampW, align: "center" });

  // Terms
  const footerY = sigY + 70;
  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text("Terms & Conditions:", 30, footerY)
    .text("• Payment due within 30 days", 30, footerY + 15)
    .text("• Goods once sold will not be taken back", 30, footerY + 30);

  doc.strokeColor("#e5e7eb").lineWidth(0.5).moveTo(30, 750).lineTo(565, 750).stroke();
  doc.fontSize(8).fillColor("#9ca3af").text("Thank you for your business!", 30, 760, { align: "center", width: 535 });

  doc.end();
};
