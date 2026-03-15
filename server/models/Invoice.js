const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    productSerialNo: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    pricePerUnit: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const mobileDetailsSchema = new mongoose.Schema(
  {
    modelNo: { type: String, trim: true },
    imei1: { type: String, trim: true },
    imei2: { type: String, trim: true },
    snNo: { type: String, trim: true },
    batteryNo: { type: String, trim: true },
    chargerNo: { type: String, trim: true },
    color: { type: String, trim: true }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    date: { type: Date, required: true },
    customerName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    isMobileInvoice: { type: Boolean, default: false },
    mobileDetails: { type: mobileDetailsSchema },
    items: { type: [itemSchema], required: true },
    grandTotal: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ date: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
