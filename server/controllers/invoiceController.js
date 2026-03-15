const Invoice = require('../models/Invoice');
const generateInvoicePDF = require('../utils/pdfGenerator');

function toNumber(n) {
  return typeof n === 'number' ? n : Number(n || 0);
}

exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, date, customerName, mobileNumber, address, items, isMobileInvoice, mobileDetails } = req.body;
    
    // Validate required fields
    if (!invoiceNumber?.trim()) {
      return res.status(400).json({ error: true, message: 'Invoice number is required' });
    }
    if (!date) {
      return res.status(400).json({ error: true, message: 'Invoice date is required' });
    }
    if (!customerName?.trim()) {
      return res.status(400).json({ error: true, message: 'Customer name is required' });
    }
    if (!mobileNumber?.trim()) {
      return res.status(400).json({ error: true, message: 'Mobile number is required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: true, message: 'Invoice must contain at least one item' });
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.itemName?.trim()) {
        return res.status(400).json({ error: true, message: `Item ${i + 1}: Item name is required` });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: true, message: `Item ${i + 1}: Valid quantity is required` });
      }
      if (!item.pricePerUnit || item.pricePerUnit < 0) {
        return res.status(400).json({ error: true, message: `Item ${i + 1}: Valid price is required` });
      }
    }

    // Recompute totals server-side
    const normalizedItems = items.map((it) => {
      const quantity = toNumber(it.quantity);
      const pricePerUnit = toNumber(it.pricePerUnit);
      const total = Math.round(quantity * pricePerUnit * 100) / 100;
      return {
        itemName: it.itemName.trim(),
        productSerialNo: it.productSerialNo?.trim() || '',
        quantity,
        pricePerUnit,
        total
      };
    });

    const grandTotal = normalizedItems.reduce((s, it) => s + it.total, 0);

    const invoice = new Invoice({
      invoiceNumber: invoiceNumber.trim(),
      date: new Date(date),
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      address: address?.trim() || '',
      isMobileInvoice: !!isMobileInvoice,
      mobileDetails: isMobileInvoice && mobileDetails ? mobileDetails : undefined,
      items: normalizedItems,
      grandTotal: Math.round(grandTotal * 100) / 100
    });

    await invoice.save();
    return res.status(201).json({ invoice });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ error: true, message: 'Invoice number already exists' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: true, message: messages.join(', ') });
    }
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '20'));
    const q = req.query.q;
    const from = req.query.from; // date
    const to = req.query.to;

    const filter = {};
    if (q) {
      filter.$or = [
        { invoiceNumber: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } }
      ];
    }
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const total = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({ invoices, total, page, limit });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) return res.status(404).json({ error: true, message: 'Invoice not found' });
    return res.json({ invoice });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};

exports.getInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) return res.status(404).json({ error: true, message: 'Invoice not found' });

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    // generate and pipe PDF to response
    return generateInvoicePDF(invoice, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Server error while generating PDF' });
  }
};
