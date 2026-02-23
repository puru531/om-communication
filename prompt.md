# 🧾 Om Communication Invoice Generator

A full-stack web application for **Om Communication** that allows the shop owner to **log in**, **create invoices**, **store them in MongoDB**, and **generate downloadable PDFs** on demand.

---

## 🏗️ Tech Stack

**Frontend**

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/) for styling

**Backend**

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [PDFKit](https://pdfkit.org/) / [jsPDF](https://github.com/parallax/jsPDF) / [pdf-lib](https://pdf-lib.js.org/) for PDF generation
- [JWT Authentication](https://jwt.io/) for secure owner login

---

## 🧭 App Overview

The system enables the **shop owner** to:

- Log in securely.
- Create new invoices for customers.
- Automatically calculate totals.
- Store all invoice data in MongoDB.
- Generate a **PDF invoice** dynamically (not stored in DB).
- View all saved invoices and re-download their PDFs.

---

## 🧾 Invoice Structure

### **Invoice Info**

- Date
- Customer Name
- Mobile Number
- Address

### **Item Table**

| Sr. No | Item Name | Product / Serial No | Quantity | Price per Unit | Total |
| :----: | --------- | ------------------- | -------- | -------------- | ----- |

- `Total = Quantity × Price per Unit`
- **Grand Total** auto-calculated at bottom

---

### **Top Section of Invoice**

- **Shop Logo**
- **Shop Name:** Om Communication
- **Address:** 123 Market Road, City, PIN
- **Mobile:** +91 XXXXX XXXXX
- **Email:** omcommunication@gmail.com
- **GST No:** XXABCDE1234F1Z2
- **Invoice No:** 2431

### **Bottom Section**

- Authorized Signature
- Shop Stamp (placeholder image for now)

---

## ⚙️ Functional Requirements

### 1. Authentication

- Single owner login (email + password)
- JWT-based auth with token expiry

### 2. Invoice Creation Form (React + Tailwind)

- Form fields for invoice details
- Dynamic table rows for adding/removing items
- Auto-calculation of totals in real-time

### 3. Invoice Management

- Save invoice data to MongoDB (no PDF stored)
- View all invoices in a dashboard table
- Click invoice → generate/download PDF instantly

### 4. PDF Generation

- PDF generated dynamically using stored invoice data
- Shop header, invoice details, and footer included
- Downloadable via button click

### 5. UI / UX

- Responsive layout using TailwindCSS
- Professional and clean invoice theme
- Simple navbar with:
  - Create Invoice
  - View Invoices
  - Logout

---

## 📁 Suggested Folder Structure

```
om-comm/
├── client/ # Vite + React + Tailwind frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/ # API calls using axios
│ │ └── App.jsx
├── server/ # Node.js + Express backend
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── controllers/ # Business logic
│ ├── utils/ # PDF generation, auth helpers
│ ├── server.js
└── .env
```

---

## 🧩 Features Summary

| Feature            | Description                            |
| ------------------ | -------------------------------------- |
| ✅ Owner Login     | Secure login with JWT                  |
| ✅ Invoice Form    | Dynamic item table with auto total     |
| ✅ MongoDB Storage | Store invoice data only                |
| ✅ Invoice List    | View all saved invoices                |
| ✅ PDF Generation  | Create & download invoices dynamically |
| ✅ Tailwind UI     | Responsive and modern design           |

---

## 🧰 Environment Variables (`.env` Example)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/omcommunication
JWT_SECRET=your_jwt_secret_key



Example MongoDB Schema (Invoice)
{
  invoiceNumber: String,
  date: Date,
  customerName: String,
  mobileNumber: String,
  address: String,
  items: [
    {
      itemName: String,
      productSerialNo: String,
      quantity: Number,
      pricePerUnit: Number,
      total: Number
    }
  ],
  grandTotal: Number
}


🌟 Optional Enhancements

🔍 Search & Filter invoices

🧾 Export all invoices to CSV/Excel

🖨️ Print-friendly PDF version

🌙 Dark/Light mode toggle

📊 Dashboard analytics (total sales, top items)



Deliverables

Full source code (frontend + backend)

Instructions for local setup

Sample invoice PDF

Example MongoDB schema

Example .env setup
```
