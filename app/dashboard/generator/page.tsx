"use client";

import { useState, FormEvent } from "react";

// Define types for our form data
interface LineItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
  units: string;
}
interface ShippingDetails {
  from: string;
  to: string;
  parcelCode: string;
  weight: string;
  size: string;
  amount: number;
}

export default function DocumentGeneratorPage() {
  const [docType, setDocType] = useState("invoice");
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState<ShippingDetails>({
    from: "FROM: Masterpiece Mega Mall...",
    to: "",
    parcelCode: "254...",
    weight: "",
    size: "",
    amount: 0,
  });
  const [items, setItems] = useState<LineItem[]>([
    { name: "", description: "", quantity: 1, price: 0, units: "Pair" },
  ]);
  const [letterhead, setLetterhead] = useState<string | null>(null);
  const [payment, setPayment] = useState({
    till: "PAY TO TILL: buy goods Till no. 4189906 (Masterpiece Empire)",
    bank: "PAY TO BANK: StanBic Bank, Kenyatta Avenue, A/C 0100010297553",
    terms:
      "TERMS:\nThis Quotation is valid for utmost 7days after date of issue.\nVAT is applied where/when Applicable",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLetterhead(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newItems = [...items];
    const { name, value } = e.target;
    (newItems[index] as any)[name] = ["quantity", "price", "amount"].includes(
      name
    )
      ? parseFloat(value) || 0
      : value;
    setItems(newItems);
  };

  const addItem = () =>
    setItems([
      ...items,
      { name: "", description: "", quantity: 1, price: 0, units: "Pair" },
    ]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShipping({
      ...shipping,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    });
  };
  const handlePaymentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        docType,
        customer,
        items,
        shipping,
        letterhead,
        payment,
      };
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error((await res.json()).message || "Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${docType}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Document Generator
        </h1>
        <p className="text-gray-500 mb-8">
          Fill in the details below to generate a professional PDF document.
        </p>
        <div className="space-y-8">
          {/* Settings & Letterhead Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="docType"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Document Type
                </label>
                <select
                  id="docType"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="invoice">Invoice</option>
                  <option value="quotation">Quotation</option>
                  <option value="delivery">Delivery Note</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="letterhead"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Custom Letterhead (Optional)
                </label>
                <input
                  type="file"
                  id="letterhead"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {letterhead && (
                  <img
                    src={letterhead}
                    alt="Letterhead Preview"
                    className="mt-4 max-h-20 border rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
          {/* Customer & Shipping Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Customer Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customer.name}
                    onChange={handleCustomerChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Shipping / Delivery
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="to"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Ship To
                  </label>
                  <textarea
                    id="to"
                    name="to"
                    rows={3}
                    placeholder="Full shipping address"
                    value={shipping.to}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Shipping Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={shipping.amount}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Line Items Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Line Items
            </h2>
            <div className="hidden md:grid grid-cols-12 gap-3 mb-2 px-1 text-sm font-medium text-gray-500">
              <div className="col-span-4">Item Name</div>
              <div className="col-span-2">Units</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-3">Price</div>
            </div>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 mb-3 p-3 bg-gray-50 rounded-md border items-end"
              >
                <div className="col-span-12 md:col-span-4">
                  <label
                    htmlFor={`name-${index}`}
                    className="block text-xs font-medium text-gray-600 md:hidden"
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id={`name-${index}`}
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label
                    htmlFor={`units-${index}`}
                    className="block text-xs font-medium text-gray-600 md:hidden"
                  >
                    Units
                  </label>
                  <input
                    type="text"
                    name="units"
                    id={`units-${index}`}
                    placeholder="Units"
                    value={item.units}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label
                    htmlFor={`quantity-${index}`}
                    className="block text-xs font-medium text-gray-600 md:hidden"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id={`quantity-${index}`}
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="col-span-10 md:col-span-3">
                  <label
                    htmlFor={`price-${index}`}
                    className="block text-xs font-medium text-gray-600 md:hidden"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id={`price-${index}`}
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-transparent md:hidden">
                    Remove
                  </label>
                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 h-10 w-full flex justify-center items-center mt-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addItem}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 mt-2 text-sm"
            >
              Add Item
            </button>
          </div>
          {/* Payment & Terms Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Payment & Terms
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="till"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Pay to Till Details
                </label>
                <textarea
                  id="till"
                  name="till"
                  rows={2}
                  value={payment.till}
                  onChange={handlePaymentChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="bank"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Pay to Bank Details
                </label>
                <textarea
                  id="bank"
                  name="bank"
                  rows={2}
                  value={payment.bank}
                  onChange={handlePaymentChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="terms"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Terms & Conditions
                </label>
                <textarea
                  id="terms"
                  name="terms"
                  rows={3}
                  value={payment.terms}
                  onChange={handlePaymentChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-green-600 text-white p-4 text-xl font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:shadow-none transition-all duration-200"
          >
            {isLoading
              ? "Generating..."
              : `Generate ${
                  docType.charAt(0).toUpperCase() + docType.slice(1)
                }`}
          </button>
        </div>
      </div>
    </div>
  );
}
