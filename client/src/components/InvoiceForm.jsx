import { useState } from "react";
import { invoices } from "../services/api";

const MOBILE_FIELDS = [
  { key: "modelNo", label: "Model No." },
  { key: "imei1", label: "IMEI No. 1" },
  { key: "imei2", label: "IMEI No. 2" },
  { key: "snNo", label: "S/N No." },
  { key: "batteryNo", label: "Battery No." },
  { key: "chargerNo", label: "Charger No." },
  { key: "color", label: "Color" },
];

const EMPTY_MOBILE = { modelNo: "", imei1: "", imei2: "", snNo: "", batteryNo: "", chargerNo: "", color: "" };

export default function InvoiceForm({ onInvoiceCreated }) {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    mobileNumber: "",
    address: "",
  });

  const [isMobileInvoice, setIsMobileInvoice] = useState(false);
  const [mobileDetails, setMobileDetails] = useState(EMPTY_MOBILE);

  const [items, setItems] = useState([
    { itemName: "", productSerialNo: "", quantity: 1, pricePerUnit: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addItem = () => setItems([...items, { itemName: "", productSerialNo: "", quantity: 1, pricePerUnit: 0 }]);
  const removeItem = (index) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = (item) => (item.quantity * item.pricePerUnit).toFixed(2);
  const calculateGrandTotal = () => items.reduce((t, item) => t + item.quantity * item.pricePerUnit, 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const invoiceData = {
        ...formData,
        isMobileInvoice,
        mobileDetails: isMobileInvoice ? mobileDetails : undefined,
        items: (isMobileInvoice
          ? [{ itemName: items[0].itemName, productSerialNo: mobileDetails.imei1 || mobileDetails.snNo || "", quantity: 1, pricePerUnit: Number(items[0].pricePerUnit), total: Number(items[0].pricePerUnit) }]
          : items.map((item) => ({ ...item, quantity: Number(item.quantity), pricePerUnit: Number(item.pricePerUnit), total: Number(calculateTotal(item)) }))
        ),
        grandTotal: isMobileInvoice ? Number(items[0].pricePerUnit) : Number(calculateGrandTotal()),
      };
      await invoices.create(invoiceData);
      setSuccess("Invoice created successfully!");
      setFormData({ invoiceNumber: "", date: new Date().toISOString().split("T")[0], customerName: "", mobileNumber: "", address: "" });
      setIsMobileInvoice(false);
      setMobileDetails(EMPTY_MOBILE);
      setItems([{ itemName: "", productSerialNo: "", quantity: 1, pricePerUnit: 0 }]);
      if (onInvoiceCreated) onInvoiceCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Create New Invoice</h2>

      {error && <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">{error}</div>}
      {success && <div className="mb-4 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded text-sm sm:text-base">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
            <input type="text" required className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" required className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input type="text" required className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input type="tel" required className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows="3" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
        </div>

        {/* Mobile invoice toggle */}
        <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
          <input
            id="mobileInvoice"
            type="checkbox"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={isMobileInvoice}
            onChange={(e) => setIsMobileInvoice(e.target.checked)}
          />
          <label htmlFor="mobileInvoice" className="text-sm font-medium text-indigo-700 cursor-pointer">
            This is a Mobile Device Invoice
          </label>
        </div>

        {/* Mobile device details — inline in the same grid */}
        {isMobileInvoice && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                required
                className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={items[0].itemName}
                onChange={(e) => updateItem(0, "itemName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={items[0].pricePerUnit}
                onChange={(e) => updateItem(0, "pricePerUnit", e.target.value)}
              />
            </div>
            {MOBILE_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={mobileDetails[key]}
                  onChange={(e) => setMobileDetails({ ...mobileDetails, [key]: e.target.value })}
                />
              </div>
            ))}
           
          </div>
        )}

        {/* Items — hidden for mobile invoices */}
        <div className={isMobileInvoice ? "hidden" : ""}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Items</h3>
            <button type="button" onClick={addItem} className="hidden sm:block px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              + Add Item
            </button>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {["Sr.", "Item Name", "Product/Serial No", "Qty", "Price", "Total", "Action"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2 text-sm">{index + 1}</td>
                    <td className="px-3 py-2"><input type="text" required className="w-full min-w-[120px] border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.itemName} onChange={(e) => updateItem(index, "itemName", e.target.value)} /></td>
                    <td className="px-3 py-2"><input type="text" className="w-full min-w-[120px] border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.productSerialNo} onChange={(e) => updateItem(index, "productSerialNo", e.target.value)} /></td>
                    <td className="px-3 py-2"><input type="number" min="1" required className="w-full max-w-[80px] border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} /></td>
                    <td className="px-3 py-2"><input type="number" min="0" step="0.01" required className="w-full max-w-[100px] border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.pricePerUnit} onChange={(e) => updateItem(index, "pricePerUnit", e.target.value)} /></td>
                    <td className="px-3 py-2 text-sm font-medium whitespace-nowrap">₹{calculateTotal(item)}</td>
                    <td className="px-3 py-2">{items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">Item #{index + 1}</span>
                  {items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Item Name *</label>
                    <input type="text" required className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.itemName} onChange={(e) => updateItem(index, "itemName", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Product/Serial No</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.productSerialNo} onChange={(e) => updateItem(index, "productSerialNo", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
                      <input type="number" min="1" required className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Price/Unit *</label>
                      <input type="number" min="0" step="0.01" required className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" value={item.pricePerUnit} onChange={(e) => updateItem(index, "pricePerUnit", e.target.value)} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Item Total:</span>
                    <span className="text-base font-bold text-gray-900">₹{calculateTotal(item)}</span>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addItem} className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              + Add Item
            </button>
          </div>

          <div className="mt-4 sm:mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-bold text-gray-900">Grand Total:</span>
              <span className="text-lg sm:text-xl font-bold text-indigo-600">₹{calculateGrandTotal()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white text-base font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
