import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { renderToStaticMarkup } from "react-dom/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import InvoiceTemplate from "@/components/documents/QuoteInvoiceTemplate";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  const { searchParams } = new URL(req.url);
  const docType = searchParams.get("type") || "invoice"; // default to invoice

  try {
    await dbConnect();

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 1. Choose the correct template based on docType
    let component;
    if (docType === "invoice") {
      component = <InvoiceTemplate order={order} />;
    } else {
      // Add logic for 'quotation', 'delivery', etc. later
      return NextResponse.json(
        { message: "Invalid document type" },
        { status: 400 }
      );
    }

    // 2. Render React component to an HTML string
    const html = renderToStaticMarkup(component);

    // 3. Inject Tailwind CSS into the HTML
    const tailwindCssPath = path.join(process.cwd(), "app", "globals.css");
    const tailwindCss = fs.readFileSync(tailwindCssPath, "utf-8");
    const finalHtml = html.replace("</style>", `${tailwindCss}</style>`);

    // 4. Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });
    await browser.close();

    // 5. Return the PDF as the response
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${docType}_${orderId}.pdf`,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
