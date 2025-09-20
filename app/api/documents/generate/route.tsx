import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { QuoteInvoicePDF } from "@/components/documents/QuoteInvoiceTemplate";
import { DeliveryNotePDF } from "@/components/documents/DeliveryNoteTemplate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.docType) {
      return NextResponse.json(
        { message: "Document type is required." },
        { status: 400 }
      );
    }

    let documentComponent;

    if (body.docType === "invoice" || body.docType === "quotation") {
      documentComponent = <QuoteInvoicePDF data={body} />;
    } else if (body.docType === "delivery") {
      documentComponent = <DeliveryNotePDF data={body} />;
    } else {
      return NextResponse.json(
        { message: "Invalid document type." },
        { status: 400 }
      );
    }

    // Render to stream
    const pdfStream = await renderToStream(documentComponent);

    // Convert Node stream → Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Return as NextResponse with ArrayBuffer
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${body.docType}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
